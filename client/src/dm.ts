/**
 * 逆向自：
 * s1.hdslb.com/bfs/seed/jinkela/short/user-fingerprint/bili-user-fingerprint.min.js
 */

function randint(a: number, b?: number): number {
	if (b === undefined)
		return Math.floor(a * Math.random());
	else
		return Math.floor(a + (b - a) * Math.random());
}

function encodeWH([w, h]: readonly [number, number]) {
	const r = randint(114);
	return [
		2 * w + 2 * h + 3 * r,
		4 * w - h + r,
		r
	];
}

function encodeOffset([top, left]: readonly [number, number]) {
	const r = randint(514);
	return [
		3 * top + 2 * left + r,
		4 * top - 4 * left + 2 * r,
		r
	];
}

const TAG_CODE = {
	'span': 1,
	'div': 2,
	'p': 3,
	'a': 4,
	'img': 5,
	'input': 6,
	'button': 7,
	'ul': 8,
	'ol': 9,
	'li': 10,
	'h1': 11,
	'h2': 12,
	'h3': 13,
	'h4': 14,
	'h5': 15,
	'h6': 16,
	'form': 17,
	'textarea': 18,
	'select': 19,
	'option': 20,
	'table': 21,
	'tr': 22,
	'td': 23,
	'th': 24,
	'label': 25,
	'strong': 26,
	'em': 27,
	'section': 28,
	'article': 29
};

function encodeTag(tag: keyof typeof TAG_CODE) {
	return TAG_CODE[tag];
}

function encodeClassName(className: string) {
	return btoa(className).slice(0, -2);
}

type DomType = {
	tag: keyof typeof TAG_CODE,
	className: string,
	rect: {
		top: number,
		left: number,
		width: number,
		height: number,
	},
};

const WH = [1528, 828] as const;
const Offset = [0, 0] as const;
const DOMS: DomType[] = [
	{
		tag: 'span',
		className: 'nav-tab__item-text',
		rect: {
			top: 224,
			left: 84,
			width: 32,
			height: 16,
		},
	}, // 主页
	{
		tag: 'a',
		className: 'active router-link-exact-active nav-tab__item',
		rect: {
			top: 200,
			left: 60,
			width: 56,
			height: 64,
		},
	}, // 主页
	{
		tag: 'span',
		className: 'nav-tab__item-text',
		rect: {
			top: 224,
			left: 256,
			width: 32,
			height: 16,
		},
	}, // 投稿
	{
		tag: 'a',
		className: 'active nav-tab__item',
		rect: {
			top: 200,
			left: 232,
			width: 87,
			height: 64,
		},
	}, // 投稿
];

function encodeDom(dom: DomType) {
	const { tag, className, rect: { top, left, width, height } } = dom;
	const t = encodeTag(tag);
	const c = encodeClassName(className);
	const p = encodeWH([top, left]);
	const s = encodeOffset([width, height]);
	return {
		t, c,
		p: [p[0], p[2], p[1]],
		s: [s[2], s[0], s[1]],
	};
}

function genDmImgInter(dom: DomType) {
	const ds = [encodeDom(dom)];
	const wh = encodeWH(WH);
	const of = encodeOffset(Offset);
	const dm_img_inter = { ds, wh, of };
	return encodeURIComponent(JSON.stringify(dm_img_inter));
}

const EVENT_TYPE_CODE = {
	'mousemove': 0,
	'click': 1,
	'keydown': 2,
	'wheel': 3,
	'touch': 4,
	'focus': 5,
};

type EventType = {
	timestamp: number,
	type: keyof typeof EVENT_TYPE_CODE,
	x: number,
	y: number,
	key?: string
};

function encodeEvent(evt: EventType, index: number) {
	const { timestamp, type, x, y, key } = evt;
	const z = randint(114 * index);
	return {
		x: 3 * x + 2 * y + z,
		y: 4 * x - 5 * y + z,
		z, timestamp,
		k: key ? key.charCodeAt(0) : randint(60, 127),
		type: EVENT_TYPE_CODE[type],
	};
}

function genEvents(dom: DomType): EventType[] {
	const { top, left, width, height } = dom.rect;
	const t0 = randint(300);
	const t1 = t0 + randint(300); // 虽然间隔理应为 100，但是前几个间隔可以适当放宽
	const x = left + randint(width);
	const y = top + randint(height);
	return [
		{
			timestamp: t0,
			type: 'mousemove',
			x, y,
		},
		{
			timestamp: t1,
			type: 'click',
			x, y,
		},
	]
}

function genDmImgList(dom: DomType) {
	const dm_img_list = genEvents(dom).map(encodeEvent);
	return encodeURIComponent(JSON.stringify(dm_img_list));
}

const webglStr = 'WebGL 1.0 (OpenGL ES 2.0 Chromium)';
const webglVendorAndRenderer = 'ANGLE (Intel, Intel(R) Arc(TM) 140T GPU (16GB) (0x00007D51) Direct3D11 vs_5_0 ps_5_0, D3D11)Google Inc. (Intel)';

function genDm() {
	const dom = DOMS[randint(DOMS.length)];
	return {
		dm_img_list: genDmImgList(dom),
		dm_img_inter: genDmImgInter(dom),
		dm_img_str: btoa(webglStr).slice(0, -2),
		dm_cover_img_str: btoa(webglVendorAndRenderer).slice(0, -2),
	}
}
