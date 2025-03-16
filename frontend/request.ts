/// <reference path="./type.ts"/>
/// <reference path="./md5.js" />
/// <reference path="./dm.ts"/>

const API_URL = 'api/';

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
		const url = `${api}?${paramstr}&w_rid=${w_rid}`;
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
	dm_cover_img_str: 'QU5HTEUgKEludGVsLCBJbnRlbChSKSBVSEQgR3JhcGhpY3MgNjIwICgweDAwMDAzRUEwKSBEaXJlY3QzRDExIHZzXzVfMCBwc181XzAsIEQzRDExKUdvb2dsZSBJbmMuIChJbnRlbC',
}));

/**
 * 必须精确传入参数，不能有冗余项
 */
const get_info = make_request<Info, { mid: Mid }>(INFO_URL, {
	// dm_img_list: genDmImgList(),
	dm_img_inter: genDmImgInter(),
	dm_img_str: 'V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ',
	dm_cover_img_str: 'QU5HTEUgKEludGVsLCBJbnRlbChSKSBVSEQgR3JhcGhpY3MgNjIwICgweDAwMDAzRUEwKSBEaXJlY3QzRDExIHZzXzVfMCBwc181XzAsIEQzRDExKUdvb2dsZSBJbmMuIChJbnRlbC',
	w_webid: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcG1faWQiOiIzMzMuOTk5IiwiYnV2aWQiOiI1MEFCMTQyNC0wMUNCLTYzN0UtOEFCNS1GNDQ0MERCMDNEM0Y2NjAxOGluZm9jIiwidXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzQuMC4wLjAgU2FmYXJpLzUzNy4zNiBFZGcvMTM0LjAuMC4wIiwiYnV2aWRfZnAiOiJjNDQ0MGU4YzlmMjk4YTMzMjFkNjIyODA4OGQwOWFiNSIsImJpbGlfdGlja2V0IjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJbXRwWkNJNkluTXdNeUlzSW5SNWNDSTZJa3BYVkNKOS5leUpsZUhBaU9qRTNOREl6TkRnNE9EZ3NJbWxoZENJNk1UYzBNakE0T1RZeU9Dd2ljR3gwSWpvdE1YMC4wU0VyVEotM0Rsek82ckRCZndqNy15c0s5dkNnWE5LWFRfVy1jZHRCa3ZNIiwiY3JlYXRlZF9hdCI6MTc0MjA4OTY5NywidHRsIjo4NjQwMCwidXJsIjoiLzE3NTMzMjk0P3NwbV9pZF9mcm9tPTMzMy4zMzcuMC4wIiwicmVzdWx0IjowLCJpc3MiOiJnYWlhIiwiaWF0IjoxNzQyMDg5Njk3fQ.coLY6NIIB4TMYp3l3Fi56HKrrvZABp1ckSfQzYyKky9irswfBdbfh9DPrsNADbwVB0huC9VK2iEmQJjdCLUW1qGNbXD7-3qFYk1rgefOad-h6rOZK6eAedyPRoSzDoIw0U77IhMdbHHvcgv4QJZYY_aiIZA8zd_LzE1o3ec7H5jiP4UrojEhoatCRkjc5UNlNJkA3JQMJQEhnBeg0Cvltc6FWvcTjG6rjhptGC6LiIHrdIfB7QrzNz9L9h6GP5H6ufQlvAPyEhomr4_a2WxVKzo4Smbo1RoxAibZv9kQ4Xz7_K2HmKUKwyiJpC-iieihrzVnbIf8sBWbFVm3_S8MDw',
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