type Finger = {
	code: 0,
	data: {
		b_3: string,
		b_4: string,
	},
	message: string // 'ok'
};

const FINGER_URL = 'https://api.bilibili.com/x/frontend/finger/spi';

const MAX_USAGE = 100;
var finger: Promise<Finger>;
var count = MAX_USAGE;

export async function genHeader() {
	if (count >= MAX_USAGE) {
		if (count > MAX_USAGE) throw '断言失败，代码写的不好啊/doge';
		count = 0;
		finger = fetch(FINGER_URL).then(res => res.json() as Promise<Finger>);
	}
	const buvid3 = (await finger)['data']['b_3'];
	++count;
	return ({
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
		'Cookie': `buvid3=${buvid3};`,
		'Referer': 'https://space.bilibili.com/'
	});
}
