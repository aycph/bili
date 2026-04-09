import { createHmac } from 'crypto';

const UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0';

type CookieKey = 'buvid3' | 'buvid4' | 'b_nut' | 'bili_ticket' | 'b_lsid';

type CookieType = {
	[key in CookieKey]?: any;
};

async function genBuvid34() {
	const FINGER_URL = 'https://api.bilibili.com/x/frontend/finger/spi';
	const finger = await fetch(FINGER_URL).then(res => res.json());
	const { b_3, b_4 } = finger['data'];
	const b_nut = Math.floor(Date.now() / 1000);
	return {
		buvid3: b_3,
		// buvid4: b_4,
		b_nut,
	};
}

function hmacSha256(key: string, message: string): string {
	const hmac = createHmac('sha256', key);
	hmac.update(message);
	return hmac.digest('hex');
}

async function genTicket(csrf: string = '') {
	const TICKET_URL = 'https://api.bilibili.com/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket';
	const ts = Math.floor(Date.now() / 1000).toString();
	const hexSign = hmacSha256('XgwSnGZ1p', 'ts' + ts);
	const params = new URLSearchParams({
		key_id: 'ec02',
		hexsign: hexSign,
		'context[ts]': ts,
		csrf: csrf,
	});
	const ticket = await fetch(`${TICKET_URL}?${params.toString()}`, {
		method: 'POST',
		headers: {
			'User-Agent': UserAgent,
		}
	}).then(res => res.json());
	const bili_ticket = ticket['data']['ticket'];
	return { bili_ticket };
}

async function genCookies(): Promise<CookieType> {
	const buvid34 = await genBuvid34();
	const ticket = await genTicket();
	return { ...buvid34, ...ticket };
}

function cookies2str(cookies: CookieType) {
	const b_lsid = `${Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0')}_${Date.now().toString(16)}`.toUpperCase();
	cookies = {
		...cookies,
		b_lsid,
	};
	return Object.entries(cookies).map((([key, value]) => `${key}=${value}`)).join('; ');
}

const MAX_USAGE = 100;
var cookies: Promise<CookieType>;
var count = MAX_USAGE;

export async function genHeader() {
	if (count >= MAX_USAGE) {
		if (count > MAX_USAGE) throw '断言失败，代码写的不好啊/doge';
		count = 0;
		cookies = genCookies();
		cookies.then(cookies => console.error('Cookie Refreshed', cookies));
	}
	const cookie = cookies2str(await cookies);
	++count;
	return ({
		'User-Agent': UserAgent,
		'Referer': 'https://space.bilibili.com/',
		'Origin': 'https://space.bilibili.com/',
		'Cookie': cookie,
	});
}
