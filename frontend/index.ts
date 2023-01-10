/// <reference path="./type.ts"/>
/// <reference path="./request.ts"/>
/// <reference path="./feed-card.ts"/>

async function main() {

	const ups: Up[] = await fetch('bili.json').then(res => res.json());

	const videos: Param[] = [];
	for (let up of ups) {
		const vlist = await request(up.mid);
		videos.push(...convert(vlist).slice(0,6));
	}

	videos.sort((a, b) => b['created'] - a['created']);

	const root = document.getElementById('CPH')!;
	for (let video of videos.slice(0, 24)) {
		root.innerHTML += make_card(video);
	}

}

window.onload = main;