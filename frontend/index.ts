/// <reference path="./type.ts"/>
/// <reference path="./request.ts"/>
/// <reference path="./make-card.ts"/>

async function part1(ups: Up[]) {
	const videos = (await Promise.all(
		ups.map( up => request(up.mid).then(convert).then(vlist => vlist.slice(0, 15)) )
		)).flat();

	videos.sort((a, b) => b['created'] - a['created']);

	const alert_set = new Set<Up>();
	const root = document.getElementById('CPH')!;
	for (let i = 0, cnt = 0; cnt < 30; ++cnt) {
		const video = videos[i];
		root.innerHTML += make_card(video);
		while (videos[++i]['bvid'] === video['bvid']);
	}
}

async function part2(ups: Up[]): Promise<{ old: string, now: string }[]> {

	const alert_list: { old: string, now: string }[] = []

	const infos = await Promise.all( ups.map( async up => {
		const info = await get_info(up.mid);
		const now = info['data']['name'], old = up.name;
		if (now !== old) alert_list.push({ old, now })
		return info;
	}) )

	const live_rooms: LiveParam[] = infos.map(convert2_live_param).filter(param => param !== null) as LiveParam[];
	const root = document.getElementById('cphcph')!;
	root.innerHTML = live_rooms.map(make_live).join();

	return alert_list;
}

async function main() {

	const bili: [Up[], Up[]] = await fetch('bili.json').then(res => res.json());
	const ups = bili.flat();

	const [ , alert_list] = await Promise.all([
		part1(ups),
		part2(ups),
	])

	for (let { old, now } of alert_list) {
		alert(`“${old}” 已经更名为 “${now}”`);
	}
}

window.onload = () => main().then(() => fetch('exit')).catch(err => {
	console.error(err); // 虽然好像没什么用……
	alert('出错哩~');
});