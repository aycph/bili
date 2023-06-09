/// <reference path="./type.ts"/>
/// <reference path="./md5.js" />

const API_URL = 'http://localhost:8000/api/'

const SEARCH_URL = API_URL + 'search';
const INFO_URL = API_URL + 'info';

const RETRY_COUNT = 5;

const TOKEN = '5a73a9f6609390773b53586cce514c2e';

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

function make_request<O extends { code: 0 }, Args extends unknown[]>(args2url: (...args: Args) => string) {
	type _O = O | PossibleErrors;
	return async (...args: Args): Promise<O> => {
		const url = args2url(...args);
		let cnt = 0;
		do {
			const res = await fetch(url).then(parseJSON<_O>);
			if (res.code === 0) return res;
			if (res.code === -401) throw { url, res }; // 非法访问
			console.info(`request failed, retrying count ${cnt + 1}...`, { url, res });
			if (++cnt === RETRY_COUNT) throw { url, res };
		} while (true);
	}
}

function wrap_url(paramstr: string): string {
	const wts = Math.round(Date.now() / 1000);
	paramstr += `&wts=${wts}`;
	const w_rid = md5(paramstr + TOKEN);
	paramstr += `&w_rid=${w_rid}`;
	return '?' + paramstr;
}

const request = make_request<Search, [Up['mid']]>(mid => SEARCH_URL + wrap_url(`index=1&mid=${mid}&order=pubdate&order_avoided=true&platform=web&pn=1&ps=25&web_location=1550101`));
const get_info = make_request<Info, [Up['mid']]>(mid => INFO_URL + wrap_url(`mid=${mid}&platform=web&token=&web_location=1550101`));