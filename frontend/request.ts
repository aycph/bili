/// <reference path="./type.ts"/>
/// <reference path="./md5.js" />
/// <reference path="./dm.ts"/>

const API_URL = 'api/'

const NAV_URL = API_URL + 'nav';
const SEARCH_URL = API_URL + 'search';
const INFO_URL = API_URL + 'info';

const RETRY_COUNT = 1;

const TOKEN = (async function() {
	const MAGIC_ARRAY = [
		46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
		33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13
	];
	
	const R = /https:\/\/i0.hdslb.com\/bfs\/wbi\/([a-z0-9]{32}).png/;

	const o: any = await fetch(NAV_URL).then(res => res.json()); // 此处可能的异常不处理
	const img_url: string = o['data']['wbi_img']['img_url'];
	const sub_url: string = o['data']['wbi_img']['sub_url'];
	const img_key = img_url.match(R)![1];
	const sub_key = sub_url.match(R)![1];

	const key = img_key + sub_key;
	const token = MAGIC_ARRAY.map(i => key[i]).join('');
	return token;
})();

type OtherError = {
	code: -123,
	message: string,
	err: any,
	res: any
}

type PossibleErrors = RequestErrors | OtherError;

async function fetchJson<T>(url: string): Promise<T | PossibleErrors> {
	try {
		const res = await fetch(url); // headers 交由后端填补
		if (res.status !== 200) return { code: -123, message: '返回码非 200', err: null, res };
		return await res.json() as T;
	} catch (err) {
		return { code: -123, message: String(err), err, res: null };
	}
}

type ResultOrError<O> =  O | PossibleErrors;

function make_request<O extends { code: 0 }, Args extends object, DefaultArgs extends object = object>(
	api: string,
	defaultArgs: DefaultArgs | (() => DefaultArgs)
) {
	type ExactArgs<T extends Args> = Args extends { [K in keyof T]: any } ? Args : never;
	return async <RealArgs extends Args>(args: RealArgs & ExactArgs<RealArgs>): Promise<ResultOrError<O>> => {
		let cnt = 0;
		do {
			// 应当更新时间戳重新计算 url
			const wts = Math.round(Date.now() / 1000);
			if (typeof defaultArgs !== 'object') defaultArgs = defaultArgs();
			const obj = { ...defaultArgs, ...args, wts };
			const argList = Object.keys(obj).sort().map(key => `${key}=${obj[key as keyof (Args & DefaultArgs)]}`);
			const paramstr = argList.join('&');
			const w_rid = md5(paramstr + await TOKEN);
			const url = api + '?' + paramstr + '&w_rid=' + w_rid;
			const res = await fetchJson<O>(url);
			if (res.code === 0) return res;
			if (res.code === -401) return res; // 非法访问不重试
			if (++cnt === RETRY_COUNT) return res;
			console.info(`request failed, retrying count ${cnt}...`, { url, res });
		} while (true);
	}
}

/**
 * 必须精确传入参数，不能有冗余项
 */
const get_search = make_request<Search, { mid: Mid }>(SEARCH_URL, () => ({
	order_avoided: true,
	pn: 1,
	ps: 10,
	dm_img_list: genDmImgList(),
	dm_img_inter: genDmImgInter(),
	dm_img_str: 'V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ',
	dm_cover_img_str: 'QU5HTEUgKEludGVsLCBJbnRlbChSKSBVSEQgR3JhcGhpY3MgNjIwICgweDAwMDAzRUEwKSBEaXJlY3QzRDExIHZzXzVfMCBwc181XzAsIEQzRDExKUdvb2dsZSBJbmMuIChJbnRlbC'
}));

/**
 * 必须精确传入参数，不能有冗余项
 */
const get_info = make_request<Info, { mid: Mid }>(INFO_URL, {});

async function getData(up: Up) {
	const { mid } = up;
	const [info, search] = await Promise.all([get_info({ mid }), get_search({ mid })]);
	return ({ ...up, info, search });
}

type Data = ReturnType<typeof getData> extends Promise<infer R> ? R : never;
