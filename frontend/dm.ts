/**
 * Thanks to
 * https://github.com/SocialSisterYi/bilibili-API-collect/issues/868#issuecomment-1908690516
 */

function randInt(MAX: number, MIN: number = 0) {
	return Math.floor(Math.random() * (MAX - MIN) + MIN) ;
}

function genDmImgList() {
	const a = randInt(500);
	const b = randInt(500);
	const z = 0;
	const x = 3 * a + 2 * b + z;
	const y = 4 * a - 5 * b + z;
	const timestamp = randInt(300, 20);
	const k = randInt(127, 60);
	const type = 0;
	const dm_img_list = [{ x, y, z, timestamp, k, type }];
	return encodeURIComponent(JSON.stringify(dm_img_list));
}

function genDmImgInter() {
	const r = randInt(114) // 114 < 514 √
	const t = 0;
	const c = '';
	const p = [3 * r, r, r];
	const m1 = 5000, m2 = 2560;
	const s = [r, m1 + r, m2 + 2 * r];
	const wh = [3 * r, r, r];
	const of = [r, r * 2, r];
	const dm_img_inter = {
		ds: [{ t, c, p, s }],
		wh, of
	};
	return encodeURIComponent(JSON.stringify(dm_img_inter));
}
