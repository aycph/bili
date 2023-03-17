/// <reference path="./type.ts"/>
/// <reference path="./request.ts"/>
/// <reference path="./make-card.ts"/>

const MAX_NUM_PER_PAGE = 30;

var errno = false; // 全局变量，标记错误
var mid2name: { [mid: Up['mid']]: string } = {}; // 全局变量，提供 mid 与昵称映射

function make_error<T>(ret: T) {
	return (err: any) => {
		errno = true;
		console.error(err);
		return ret;
	};
}

async function part1(ups: Up[]) {
	let videos = (await Promise.all(
		ups.map( up => request(up.mid).then(convert).catch(make_error([])) )
		)).flat();

	videos.sort((a, b) => b['created'] - a['created']);

	videos = videos.filter(
		function() {
			let tmp_bvid: Param['bvid'];
			return video => video['bvid'] !== tmp_bvid && (tmp_bvid = video['bvid']);
		} ()
	);

	function render_page(videos: Param[], page: number) {
		document.getElementById('CPH')!.innerHTML = videos
			.slice((page-1) * MAX_NUM_PER_PAGE, page * MAX_NUM_PER_PAGE)
			.map(make_card).join('\n');
	
		const paginations = document.getElementById('ccpphh')!;
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
			const info = await get_info(up.mid);
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
	const root = document.getElementById('cphcph')!;
	root.innerHTML = live_rooms.map(make_live).join('\n');
	
	return { infos, alert_list };
}

async function main() {

	const bili: [Up[], Up[]] = await fetch('bili.json').then(res => res.json());
	const ups = bili.flat();
	ups.forEach(up => mid2name[up['mid']] = up['name']);

	const [{ infos, alert_list }, videos] = await Promise.all([
		part2(ups),
		part1(ups),
	])

	if (alert_list.length)
		alert(alert_list.map(({ old, now }) => `“${old}” 已经更名为 “${now}”`).join('\n'));
	
	return { infos, videos };
}

window.onload = () => main().then(console.log)
	.then(() => {
		if (errno) alert('出现了已处理的错误，请在控制台查收~');
		else fetch('exit');
	})
	.catch(err => {
		console.error(err);
		alert('出错哩~');
	});