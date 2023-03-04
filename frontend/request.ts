/// <reference path="./type.ts"/>

const API_URL = 'http://localhost:8000/api/'

const SEARCH_URL = API_URL + 'search';
const INFO_URL = API_URL + 'info';

function make_request<O extends { code: number }, Args extends unknown[]>(args2url: (...args: Args) => string) {
	return async (...args: Args) => {
		const url = args2url(...args);
		const res = await fetch(url).then(res => res.json()) as O;
		if (res.code !== 0) throw { url, res };
		return res;
	}
}

const request = make_request<Search, [Up['mid']]>(mid => `${SEARCH_URL}?mid=${mid}`);
const get_info = make_request<Info, [Up['mid']]>(mid => `${INFO_URL}?mid=${mid}`);