import * as https from 'https';

function myFetch(url: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		let content = '';
		https.get(url, res => {
			res.on('data', data => content += data);
			res.on('end', () => resolve(content));
			res.on('error', err => reject(err));
		})
	})
}

type Finger = {
    code: 0,
    data: {
        b_3: string,
        b_4: string,
    },
    message: string // 'ok'
}

var buvid3: string | undefined;
var count = 0;
const MAX_COUNT = 100;

export async function genHeader() {
	if (typeof buvid3 === 'undefined' || count >= MAX_COUNT) {
		count = 0; // 提示已有协程在更新 buvid3
		const res = await myFetch('https://api.bilibili.com/x/frontend/finger/spi');
		const finger = JSON.parse(res) as Promise<Finger>;
		buvid3 = finger['data']['b_3'];
	} else if (count === 0) { // 若 count = 0 表示已有协程在初始化了…… 等待即可
		do {
			await new Promise(resolve => setTimeout(resolve));
		} while (count === 0);
	}
	++count; // 也会提示完成更新 buvid3
	return ({
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
		'Cookie': `buvid3=${buvid3};`,
		'Referer': 'https://space.bilibili.com/'
	});
}
