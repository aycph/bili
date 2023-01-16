/// <reference path="./type.ts"/>

const API_URL = 'http://localhost:8000/api/'

const SEARCH_URL = API_URL + 'search';

async function request(mid: Up['mid']): Promise<Search> {
	return await fetch(`${SEARCH_URL}?mid=${mid}`).then(res => res.json())
}