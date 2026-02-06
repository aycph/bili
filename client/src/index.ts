/// <reference path="./type.ts"/>
/// <reference path="./utils.ts"/>
/// <reference path="./config.ts"/>
/// <reference path="./request.ts"/>
/// <reference path="./card.ts"/>

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
		.map(render_card).join('\n');

	const paginations = document.getElementById('cph-btns')!;
	paginations.innerHTML = '';
	paginations.append(
		...render_paginations(videos, MAX_NUM_PER_PAGE, page, page => render_page(videos, page))
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
		const innerHTMLs = live_rooms.map(render_live);
		innerHTMLs.push(render_live_bottom());
		root.innerHTML = innerHTMLs.join('\n');
	} else {
		root.innerHTML = '';
	}
}

function render(active_name: string, groups_names: string[], groups_info: Groups<Info[]>, groups_search: Groups<Search[]>) {
	const root = document.getElementById('cph-groups')!;
	root.innerHTML = '';
	root.append(...render_head(active_name, groups_names,
		name => render(name, groups_names, groups_info, groups_search)));
	render_lives(groups_info[active_name]);
	render_videos(groups_search[active_name]);
}

async function main() {

	const bili = await get_ups(mid2name);
	const ups = bili['ups'];

	let tasks = await Promise.all(ups.map(up => [
		get_info({ mid: up['mid'] }).then(info => ({ ...up, method: 'info', ...info}) as const),
		get_search({ mid: up['mid'] }).then(search => ({ ...up, method: 'search', ...search }) as const),
	]).flat());

	// 通过双重循环同时完成 过滤、提取、查找更名
	const failed: typeof tasks = [];
	const rename: { old: string, now: string }[] = [];
	const groups_names = [GROUP_ALL, ...bili['tags']];
	const groups_info: Groups<Info[]> = Object.fromEntries(groups_names.map(name => [name, []]));
	const groups_search: Groups<Search[]> = Object.fromEntries(groups_names.map(name => [name, []]));

	do {
		for (let item of tasks) {
			if (item['res']['code']) { // 请求错误 
				failed.push(item);
			} else if (item['method'] === 'info') { // info
				if (item['tags']) {
					for (let tag of item['tags'])
						groups_info[tag].push(item['res']);
				}
				groups_info[GROUP_ALL].push(item['res']);
				if (item['res']['data']['name'] !== item['name']) // 检查昵称是否修改
					rename.push({ old: item['name'], now: item['res']['data']['name'] });
			} else if (item['method'] === 'search') { // search
				if (item['tags']) {
					for (let tag of item['tags'])
						groups_search[tag].push(item['res']);
				}
				groups_search[GROUP_ALL].push(item['res']);
			} else { // Impossible !
				const error = new Error('出现了不可能的情况！详见控制台');
				console.error('不可能的 item', item);
				throw error;
			}
		}

		// 询问是否重试
		if (failed.length) {
			console.error('failed', failed.slice());
			const message = '以下请求失败，是否重试\n' + failed.map(
				({ method, name, res: { code, message } }) =>
					`${method} ${name}: { code: ${code}, message: ${message} }`
			).join('\n');
			if (!window.confirm(message)) break;
		} else
			break;

		// 重试
		console.info('retry');
		tasks = await Promise.all(failed.map(item => {
			switch (item.method) {
				case 'info':
					return get_info({ mid: item['mid'] }).then(info => ({ ...item, ...info}) as const);
				case 'search':
					return get_search({ mid: item['mid'] }).then(search => ({ ...item, ...search }) as const);
				default:
					const error = new Error('不可能的重试项！详见控制台');
					console.error('不可能的 item', item);
					throw error;
			}
		}));
		failed.length = 0;
	} while (true);
	fetch('/exit');

	// render
	render(GROUP_ALL, groups_names, groups_info, groups_search);

	// 更名（放在计算之后，因为错误时显然不一定能获得更新的名字）
	if (rename.length) {
		console.info('rename', rename);
		alert(rename.map(({ old, now }) => `“${old}” 已经更名为 “${now}”`).join('\n'));
	}

	return { groups_info, groups_search, failed, rename };
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
