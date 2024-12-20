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

const MAX_COUNT = 100;
var buvid3: string; // 暂未初始化
var count = MAX_COUNT; // 保证现在处于失效状态，从而初始化 buvid3

export async function genHeader() {
	// 若 count = 0 表示已有协程在初始化了…… 等待即可
	while (count === 0) await new Promise(resolve => setTimeout(resolve));
	// 若超过 MAX_COUNT 初始化
	if (count >= MAX_COUNT) {
		if (count > MAX_COUNT) throw '断言失败，代码写的不好啊/doge'
		count = 0; // 提示已有协程在更新 buvid3
		const res = await myFetch('https://api.bilibili.com/x/frontend/finger/spi');
		const finger = JSON.parse(res) as Finger;
		buvid3 = finger['data']['b_3'];
	}
	++count; // 也会提示完成更新 buvid3
	return ({
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
		'Cookie': `buvid3=${buvid3};`,
		'Referer': 'https://space.bilibili.com/'
	});
}
