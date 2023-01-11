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

	const root = document.getElementById('CPH')!;
	for (let video of videos.slice(0, 30)) {
		root.innerHTML += make_card(video);
	}

}

window.onload = main;