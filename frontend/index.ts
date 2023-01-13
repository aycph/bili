/// <reference path="./type.ts"/>
/// <reference path="./request.ts"/>
/// <reference path="./make-card.ts"/>

async function main() {

	const ups: Up[] = await fetch('bili.json').then(res => res.json());

	const videos = (await Promise.all(
		ups.map( up => request(up.mid).then(convert).then(vlist => vlist.slice(0, 15)) )
		)).flat();
	fetch('exit');

	videos.sort((a, b) => b['created'] - a['created']);

	const alert_set = new Set<Up>();
	const root = document.getElementById('CPH')!;
	for (let i = 0, cnt = 0; cnt < 30; ++cnt) {
		const video = videos[i];
		root.innerHTML += make_card(video);
		const up = ups.find(value => value['mid'] === video['mid']);
		if (up && !alert_set.has(up) && up['name'] !== video['author']) {
			alert_set.add(up);
			alert(`“${up['name']}” 已经被更名为 “${video['author']}”`);
		}
		while (videos[++i]['bvid'] === video['bvid']);
	}

}

window.onload = main;