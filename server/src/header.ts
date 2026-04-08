const INIT_URL = 'https://www.bilibili.com/';

const UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0';

const MAX_USAGE = 100;
var cookies: Promise<string[]>;
var count = MAX_USAGE;

function _lsid() {
    return `${Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0')}_${Date.now().toString(16)}`.toUpperCase();
}

async function genCookies() {
    const res = await fetch(INIT_URL);
    const setCookies = res.headers.getSetCookie();
    let cookies = setCookies.map(c => c.split(';', 1)[0]); // buvid3, b_nut
    return cookies;
}

export async function genHeader() {
	if (count >= MAX_USAGE) {
		if (count > MAX_USAGE) throw '断言失败，代码写的不好啊/doge';
		count = 0;
		cookies = genCookies();
	}
    let cookie = [...await cookies, `b_lsid=${_lsid()}`].join('; ');
	++count;
	return ({
		'User-Agent': UserAgent,
		'Referer': 'https://space.bilibili.com/',
        'Origin': 'https://space.bilibili.com/',
        'Cookie': cookie,
	});
}
