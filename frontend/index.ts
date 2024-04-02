/// <reference path="./type.ts"/>
/// <reference path="./utils.ts"/>
/// <reference path="./config.ts"/>
/// <reference path="./request.ts"/>
/// <reference path="./make-card.ts"/>

const MAX_NUM_PER_PAGE = 30;
const GROUP_ALL = 'All';

var mid2name: { [mid: Mid]: string } = {}; // 全局变量，提供 mid 与昵称映射
var logs: any; // 全局变量，用于保存输出信息方便调试

function render_page(videos: Param[], page: number, scrollCard: boolean = true) {
	const e = document.getElementById('cph-cards')!;
	if (scrollCard) e.scrollIntoView({
		block: 'start',
		inline: 'start',
		behavior: 'smooth',
	}); // 滚动到视图
	e.innerHTML = videos.slice((page-1) * MAX_NUM_PER_PAGE, page * MAX_NUM_PER_PAGE)
		.map(make_card).join('\n');

	const paginations = document.getElementById('cph-btns')!;
	paginations.innerHTML = '';
	paginations.append(
		...make_paginations(videos, MAX_NUM_PER_PAGE, page, page => render_page(videos, page))
		);
};

function render_videos(search_list: Search[]) {
	const videos = search_list.map(convert).flat()
		.sort((a, b) => b['created'] - a['created'] || a['aid'] - b['aid'])
		.filter(
			function () {
				let tmp_bvid: Param['bvid'];
				return video => video['bvid'] !== tmp_bvid && (tmp_bvid = video['bvid']);
			}()
		);
	render_page(videos, 1, false);
}

function render_lives(info_list: Info[]) {
	const live_rooms: LiveParam[] = info_list
		.map(info => info !== null ? convert2_live_param(info) : null)
		.filter(param => param !== null) as LiveParam[];
	const root = document.getElementById('cph-lives')!;
	if (live_rooms.length > 0) {
		const innerHTMLs = live_rooms.map(make_live);
		innerHTMLs.push(make_live_bottom());
		root.innerHTML = innerHTMLs.join('\n');
	} else {
		root.innerHTML = '';
	}
}

function render(active_name: string, groups_names: string[], groups_info: Groups<Info[]>, groups_search: Groups<Search[]>) {
	const root = document.getElementById('cph-groups')!;
	root.innerHTML = '';
	root.append(...make_head(active_name, groups_names,
		name => render(name, groups_names, groups_info, groups_search)));
	render_lives(groups_info[active_name]);
	render_videos(groups_search[active_name]);
}

async function main() {

	const groups_ups = await get_ups(mid2name);
	const groups = await objectPromiseAll(
		objectMap( groups_ups, (_, value) => Promise.all(value.map(getData)) )
	);

	/**
	 * 策略 1 ：只要一个请求失败，整个 up 条目作废  
	 * 策略 2 ：对 info 和 search 分别过滤，产生 groups_info 和 groups_search  
	 * 
	 * 最终选择了策略 2 ，这样各个部分会特化严重，可能会影响以后的可扩展性
	 */

	// 通过双重循环同时完成 过滤、提取、查找更名
	const failed: { method: string, name: string, mid: Mid, url: string, res: PossibleErrors }[] = [];
	const rename: { old: string, now: string }[] = [];
	const groups_info: Groups<Info[]> = {};
	const groups_search: Groups<Search[]> = {};
	const groups_names = Object.keys(groups);

	for (let key in groups) {
		const info_list: Info[] = [];
		const search_list: Search[] = [];
		for (let { mid, name, info, search } of groups[key]) {
			{// info
				const { url, res } = info;
				if (res['code']) {
					failed.push({ method: 'info', name, mid, url, res });
				} else {
					if (res['data']['name'] !== name)
						rename.push({ old: name, now: res['data']['name'] });
					info_list.push(res);
				}
			}
			{ // search
				const { url, res } = search;
				if (res['code']) {
					failed.push({ method: 'search', name, mid, url, res });
				} else {
					search_list.push(res);
				}
			}
		}
		groups_info[key] = info_list;
		groups_search[key] = search_list;
	}
	groups_info[GROUP_ALL] = Object.values(groups_info).flat();
	groups_search[GROUP_ALL] = Object.values(groups_search).flat();
	groups_names.splice(0, 0, GROUP_ALL);
	
	// render
	render(GROUP_ALL, groups_names, groups_info, groups_search);

	// 计算错误
	if (failed.length) {
		console.error('failed', failed);
		const message = '是否关闭后端\n' + failed.map(
			({ method, name, res: { code, message } }) =>
				`${method} ${name}: { code: ${code}, message: ${message} }`
		).join('\n');
		if (window.confirm(message)) fetch('exit');
	} else fetch('exit');

	// 更名（落再计算之后，因为错误时显然不一定能获得更新的名字）
	if (rename.length) {
		console.info('rename', rename);
		alert(rename.map(({ old, now }) => `“${old}” 已经更名为 “${now}”`).join('\n'));
	}

	return { groups, failed, rename };
}

window.onload = () => main()
	.then(ret => {
		console.log(ret);
		logs = ret;
	})
	.catch(err => {
		logs = err;
		console.error(err);
		alert('发生了未处理的异常\n    ' + err);
	});
