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

async function genHeader() {
	const res = await myFetch('https://api.bilibili.com/x/frontend/finger/spi');
	const finger = JSON.parse(res) as Promise<Finger>;
	return ({
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54',
		'Cookie': `buvid3=${finger['data']['b_3']};`
	});
}
