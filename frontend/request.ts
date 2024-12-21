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
	// dm_img_list: genDmImgList(),
	dm_img_inter: genDmImgInter(),
	dm_img_str: 'V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ',
	dm_cover_img_str: 'QU5HTEUgKEludGVsLCBJbnRlbChSKSBVSEQgR3JhcGhpY3MgNjIwICgweDAwMDAzRUEwKSBEaXJlY3QzRDExIHZzXzVfMCBwc181XzAsIEQzRDExKUdvb2dsZSBJbmMuIChJbnRlbC',
	w_webid: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcG1faWQiOiIwLjAiLCJidXZpZCI6IjY0RURBM0JFLTk1QzYtOTI1MC1DNTAxLUQ5OTQ5NTUzQjRBRjYzMDEyaW5mb2MiLCJ1c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMS4wLjAuMCBTYWZhcmkvNTM3LjM2IEVkZy8xMzEuMC4wLjAiLCJidXZpZF9mcCI6IjJkZTUzOTdkOTYxMzI5YjJiNWY4M2Q1OGU0N2E3ZjRjIiwiY3JlYXRlZF9hdCI6MTczNDY5MjgxMywidHRsIjo4NjQwMCwidXJsIjoiLzQ4NzYxNDg3NiIsInJlc3VsdCI6Im5vcm1hbCIsImlzcyI6ImdhaWEiLCJpYXQiOjE3MzQ2OTI4MTN9.kAyr8b_4W1r8nfp0LcrBWttV-LkhLQ-gdvhtsteBFGsSw4REJY9buIIhodNBeW2BvTMIFHRQdunlt5dUnaFF0lTAkMUmEv2e-JukhUo3th1ii_eJGyFviX877FKp0m5k9K1VHtY_-lJp9KQL2NJUv6aBgyd_4JwrB_XSPU7bKuJfiHD_5_6mI-wsnz1DqJwYxeLt_FzONjWi9vUy9n0oaLXB5lswfBHcZtGcZ-Eh4m5wL4m9kuOMT6xJGZknU4sRr8Ceb8d7mapsjOJXfqvollaa5zdkGH1t7Wom8bdVcl1mxUP5YxSh5P5ae1W9x4CYKXAGFhQldcCHwYp68P_1Wg'
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