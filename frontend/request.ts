/// <reference path="./type.ts"/>
/// <reference path="./md5.js" />
/// <reference path="./dm.ts"/>

const API_URL = 'api/'

const NAV_URL = API_URL + 'nav';
const SEARCH_URL = API_URL + 'search';
const INFO_URL = API_URL + 'info';

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
})().catch(error => {
	error.toString = () => '计算 TOKEN 失败';
	throw error;
});

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
		if (res.status !== 200) return { code: -123, message: `${res.status}: ${res.statusText}`, err: null, res };
		return await res.json() as T;
	} catch (err) {
		return { code: -123, message: String(err), err, res: null };
	}
}

type ResultWithUrl<Result> = {
	url: string,
	res: Result | PossibleErrors
};

function make_request<O extends { code: 0 }, Args extends object, DefaultArgs extends object = object>(
	api: string,
	defaultArgs: DefaultArgs | (() => DefaultArgs)
) {
	type ExactArgs<T extends Args> = Args extends { [K in keyof T]: any } ? Args : never;
	return async <RealArgs extends Args>(args: RealArgs & ExactArgs<RealArgs>): Promise<ResultWithUrl<O>> => {
		const wts = Math.round(Date.now() / 1000);
		if (typeof defaultArgs !== 'object') defaultArgs = defaultArgs();
		const obj = { ...defaultArgs, ...args, wts };
		const argList = Object.keys(obj).sort().map(key => `${key}=${obj[key as keyof (Args & DefaultArgs)]}`);
		const paramstr = argList.join('&');
		const w_rid = md5(paramstr + await TOKEN);
		const url = `${api}?${paramstr}&w_rid=${w_rid}`
		const res = await fetchJson<O>(url);
		return { url, res };
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
const get_info = make_request<Info, { mid: Mid }>(INFO_URL, {
	dm_img_str: 'V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ',
	dm_cover_img_str: 'QU5HTEUgKEludGVsLCBJbnRlbChSKSBVSEQgR3JhcGhpY3MgNjIwICgweDAwMDAzRUEwKSBEaXJlY3QzRDExIHZzXzVfMCBwc181XzAsIEQzRDExKUdvb2dsZSBJbmMuIChJbnRlbC',
	w_webid: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcG1faWQiOiIwLjAiLCJidXZpZCI6IjIzQzc0MkVCLUMyOUYtMUJGMC01RjRBLUIzMjlFNEQ4NEJDRjQzMzIwaW5mb2MiLCJ1c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2IEVkZy8xMjkuMC4wLjAiLCJidXZpZF9mcCI6ImI5ZTRiNTQzNTgyNzdjZjYzZDNiYTU0MGE3ZjRiOWQxIiwiY3JlYXRlZF9hdCI6MTcyODg5MjA4NiwidHRsIjo4NjQwMCwidXJsIjoiLzEwMzMwNzQwP3NwbV9pZF9mcm9tPTMzMy4zMzcuc2VhcmNoLWNhcmQuYWxsLmNsaWNrIiwicmVzdWx0Ijoibm9ybWFsIiwiaXNzIjoiZ2FpYSIsImlhdCI6MTcyODg5MjA4Nn0.olorHUSKhKL7rLJAFA_nyrr8AEqNyVf4SUJiWzIRzh_dxNM2GP50jG-PIs52VN9-Yf_AYNOR8owhEbSF28piLzsb76wGyt1U8OzbCTpwD0e1ukvPl0DnXz4I3pfOJif34ctRKW-WbpUittzI87TADDfGR6215Cidt7QTrd0lh6g4qfUltjPWKq9eOUFVoCACK5YSg0ER-4kpylQJ--tzhRm85vowEU5oR-yCv4nUL_82ZlAvuSkkB7p-7zGdx1b0FdAum00VMaPWzzSXP56i25kt9M5sDBfgSzU1xDDDPsxT9kXyT8JpTqGOADN4MmxdsZ5jPrf_PhMr0XkfvUjziA'
});

/**
 * 出于一些原因放弃了 Data ~~的可扩展性和复用性~~：
 * 1. 难以使用通用的类型注记，因为必须能够静态的获得数据类型，因此显式传参动态构造 class Data 看起来是唯一选择
 * 2. 我们的 get_search 和 get_info 都需要精确传入参数，不能有任何冗余，虽然现在均为 { mid: Mid }，但新的接口是否仍是如此
 * 3. get_info 和 get_search 逻辑上是解耦的……无需以用户为单位获取
class Data {
	private readonly up: Up;
	private datas;

	constructor(up: Up) {
		const { mid } = up;
		this.up = up;
		this.datas = [
			get_info({ mid }),
			get_search({ mid }),
		] as const;
	}

	getData() {
		return Promise.all(this.datas).then(([info, search]) => ({ ...this.up, info, search }));
	}

	retry(): void {
		// async is not necessary!
		const { mid } = this.up;
		let [pinfo, psearch] = this.datas;
		pinfo = pinfo.then(info => info['res']['code'] === 0 ? info : get_info({ mid }));
		psearch = psearch.then(search => search['res']['code'] === 0 ? search : get_search({ mid }));
		this.datas = [pinfo, psearch] as const;
	}
}

type DataType = ReturnType<Data['getData']> extends Promise<infer R> ? R : never;
*/