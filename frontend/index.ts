/// <reference path="./type.ts"/>
/// <reference path="./request.ts"/>
/// <reference path="./make-card.ts"/>

const MAX_NUM_PER_PAGE = 30;

var errno = false; // 全局变量，标记错误
var mid2name: { [mid: Up['mid']]: string } = {}; // 全局变量，提供 mid 与昵称映射
var logs: any; // 全局变量，用于保存输出信息方便调试

var errors: { url: string, res: BaseError }[] = [];
function get_mid(url: string): number {
	return parseInt(url.match(/mid=(\d+)/)![1]);
}
function get_api(url: string): string {
	return url.match(/\/(\w*)(\?.*)?$/)![1]
}
function errors2str(): string {
	try {
		return errors.map(
			({ url, res: { code, message } }) => `${get_api(url)} ${mid2name[get_mid(url)]}: { code: ${code}, message: ${message} }`
			).join('\n');
	} catch {
		return '捕获了不期待的异常格式~';
	}
}

function make_error<T>(ret: T) {
	return (err: any) => {
		errno = true;
		errors.push(err);
		console.error(err);
		return ret;
	};
}

function isObject(o: any): o is { [key: string]: any } {
	return typeof o === 'object' && o !== null && !Array.isArray(o);
}

async function get_ups() {
	const bili = await fetch('bili.json').then(res => res.json()); // as { [group: string]: Up[] }
	// 检查 bili 类型并查重，生成 mid2name 并返回 Up[]
	let results: Up[] = [];
	if (!isObject(bili))
		throw 'bili.json 应该被解析为一个对象/字典';
	for (let key in bili) {
		const ups = bili[key];
		if (!Array.isArray(ups)) throw `每个键的值应为数组，但 ${key} 的键不是`;
		for (let i = 0; i < ups.length; ++i) {
			const up = ups[i];
			if (!isObject(up))
				throw `${key} 分组下第 ${i + 1} 个条目不为对象/字典`;
			const mid = up['mid'];
			if (typeof mid !== 'number' && typeof mid !== 'string')
				throw `${key} 分组下第 ${i + 1} 个条目的 mid 属性不为 number 或 string`;
			const name = up['name'];
			if (typeof name !== 'string')
				throw `${key} 分组下第 ${i + 1} 的 name 属性不为 string`;
			if (mid2name[mid] !== undefined)
				throw `${key} 分组下第 ${i + 1} 个条目 “${name}” 和之前的 “${mid2name[mid]}” mid ${mid} 重复`;
			mid2name[mid] = name;
			results.push({ mid, name });
		}
	}
	return results;
}

async function part1(ups: Up[]) {
	let videos = (await Promise.all(
		ups.map( up => get_search({ mid: up.mid }).then(convert).catch(make_error([])) )
		)).flat();

	videos.sort((a, b) => b['created'] - a['created']);

	videos = videos.filter(
		function() {
			let tmp_bvid: Param['bvid'];
			return video => video['bvid'] !== tmp_bvid && (tmp_bvid = video['bvid']);
		} ()
	);

	function render_page(videos: Param[], page: number) {
		document.getElementById('cph-cards')!.innerHTML = videos
			.slice((page-1) * MAX_NUM_PER_PAGE, page * MAX_NUM_PER_PAGE)
			.map(make_card).join('\n');
	
		const paginations = document.getElementById('cph-btns')!;
		paginations.innerHTML = '';
		paginations.append(
			...make_paginations(videos, MAX_NUM_PER_PAGE, page, page => render_page(videos, page))
			);
	};
	render_page(videos, 1);

	return videos;
}

async function part2(ups: Up[]) {

	const alert_list: { old: string, now: string }[] = []

	const infos = await Promise.all( ups.map( async up => {
		try {
			const info = await get_info({ mid: up.mid });
			const now = info['data']['name'], old = up.name;
			if (now !== old) alert_list.push({ old, now })
			return info;
		} catch (err) {
			return make_error(null)(err);
		}
	}) )

	const live_rooms: LiveParam[] = infos
		.map(info => info !== null ? convert2_live_param(info) : null)
		.filter(param => param !== null) as LiveParam[];
	const root = document.getElementById('cph-lives')!;
	root.innerHTML = live_rooms.map(make_live).join('\n') + root.innerHTML;
	
	return { infos, alert_list };
}

async function main() {

	const ups = await get_ups();

	const [{ infos, alert_list }, videos] = await Promise.all([
		part2(ups),
		part1(ups),
	])

	if (alert_list.length)
		alert(alert_list.map(({ old, now }) => `“${old}” 已经更名为 “${now}”`).join('\n'));
	
	return { infos, videos };
}

window.onload = () => main().then(ret => { console.log(ret); logs = ret; })
	.then(() => {
		if (!errno || window.confirm(errors2str() + '\n是否关闭后端'))
			fetch('exit');
	})
	.catch(err => {
		console.error(err);
		alert('出错哩~\n' + err);
	});