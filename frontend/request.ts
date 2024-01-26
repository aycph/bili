/// <reference path="./type.ts"/>
/// <reference path="./md5.js" />
/// <reference path="./dm.ts"/>

const API_URL = 'http://localhost:8001/api/'

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

	const o: any = await fetch(NAV_URL).then(res => res.json());
	const img_url: string = o['data']['wbi_img']['img_url'];
	const sub_url: string = o['data']['wbi_img']['sub_url'];
	const img_key = img_url.match(R)![1];
	const sub_key = sub_url.match(R)![1];

	const key = img_key + sub_key;
	const token = MAGIC_ARRAY.map(i => key[i]).join('');
	return token;
})();

type ParseError = {
	code: -123,
	message: string,
	err: any,
	res: any
}

async function parseJSON<T>(res: Response): Promise<T | ParseError> {
	if (res.status !== 200) return { code: -123, message: '返回码非 200', err: null, res };
	try {
		return await res.json() as Promise<T>;
	} catch (err) {
		return { code: -123, message: 'CPH 不知道为什么 parseJSON 错了', err, res };
	}
}

function make_request<O extends { code: 0 }, Args extends object, DefaultArgs extends object = object>(
	api: string,
	defaultArgs: DefaultArgs | (() => DefaultArgs)
) {
	type _O = O | PossibleErrors;
	return async (args: Args): Promise<O> => {
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
			const res = await fetch(url).then(parseJSON<_O>); // headers 交由后端填补
			if (res.code === 0) return res;
			if (res.code === -401) throw { url, res }; // 非法访问不重试
			console.info(`request failed, retrying count ${cnt + 1}...`, { url, res });
			if (++cnt === RETRY_COUNT) throw { url, res };
		} while (true);
	}
}

const get_search = make_request<Search, { mid: Up['mid'] }>(SEARCH_URL, () => ({
	order_avoided: true,
	pn: 1,
	ps: 20,
	index: 1,
	order: 'pubdate',
	platform: 'web',
	web_location: 1550101,
	dm_img_list: genDmImgList(),
	dm_img_inter: genDmImgInter(),
	dm_img_str: 'V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ',
	dm_cover_img_str: 'QU5HTEUgKEludGVsLCBJbnRlbChSKSBVSEQgR3JhcGhpY3MgNjIwICgweDAwMDAzRUEwKSBEaXJlY3QzRDExIHZzXzVfMCBwc181XzAsIEQzRDExKUdvb2dsZSBJbmMuIChJbnRlbC'
}));

const get_info = make_request<Info, { mid: Up['mid'] }>(INFO_URL, {});
