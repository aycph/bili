/// <reference path="./type.ts"/>

const API_URL = 'http://localhost:8000/api/'

const SEARCH_URL = API_URL + 'search';
const INFO_URL = API_URL + 'info';

async function request(mid: Up['mid']): Promise<Search> {
	return await fetch(`${SEARCH_URL}?mid=${mid}`).then(res => res.json())
}

async function get_info(mid: Up['mid']): Promise<Info> {
	return await fetch(`${INFO_URL}?mid=${mid}`).then(res => res.json())
}