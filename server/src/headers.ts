import { createHmac } from 'crypto';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0';

async function fetchBuvid() {
	const FINGER_URL = 'https://api.bilibili.com/x/frontend/finger/spi';
	type Finger = {
		code: 0,
		data: {
			b_3: string,
			b_4: string,
		},
		message: 'ok',
	};
	const res: Finger = await fetch(FINGER_URL).then(res => res.json());
	const { b_3, b_4 } = res['data'];
	const b_nut = Math.floor(Date.now() / 1000);
	return {
		buvid3: b_3,
		buvid4: b_4,
		b_nut,
	};
}

function hmacSha256(key: string, message: string): string {
	const hmac = createHmac('sha256', key);
	hmac.update(message);
	return hmac.digest('hex');
}

// Thanks to https://github.com/pskdje/bilibili-API-collect/blob/main/docs/misc/sign/bili_ticket.md
async function fetchTicket(csrf: string = '') {
	const TICKET_URL = 'https://api.bilibili.com/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket';
	type Ticket = {
		code: 0,
		message: 'OK',
		data: {
			ticket: string,
			created_at: number,
			ttl: 259200,
		},
	};
	const ts = Math.floor(Date.now() / 1000).toString();
	const hexSign = hmacSha256('XgwSnGZ1p', 'ts' + ts);
	const params = new URLSearchParams({
		key_id: 'ec02',
		hexsign: hexSign,
		'context[ts]': ts,
		csrf: csrf,
	});
	const res: Ticket = await fetch(`${TICKET_URL}?${params.toString()}`, {
		method: 'POST',
		headers: {
			'User-Agent': USER_AGENT,
		}
	}).then(res => res.json());
	const { ticket, created_at, ttl } = res['data'];
	return {
		bili_ticket: ticket,
		bili_ticket_expires: created_at + ttl,
	};
}

function genBlsid() {
	return `${Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0')}_${Date.now().toString(16)}`.toUpperCase();
}

type CookieKey = 'buvid3' | 'buvid4' | 'b_nut' | 'bili_ticket' | 'bili_ticket_expires' | 'b_lsid';

type Cookie = {
	readonly LIMIT: number,
	cache: Promise<Partial<Record<CookieKey, string | number>>>,
	count: number,
	get(): Promise<string>,
	refresh(): void,
};

const cookie: Cookie = {
	LIMIT: 100,
	cache: Promise.resolve({}),
	count: Infinity,
	async get() {
		if (this.count >= this.LIMIT) this.refresh();
		++this.count;
		const cookies = {
			...await this.cache,
			b_lsid: genBlsid(),
		};
		return Object.entries(cookies).map((([key, value]) => `${key}=${value}`)).join('; ');
	},
	refresh() {
		this.count = 0;
		this.cache = Promise.all([fetchBuvid(), fetchTicket()]).then(([buvid, ticket]) => ({ ...buvid, ...ticket }));
		this.cache.then(cookies => console.log('Cookie Refreshed', cookies));
	},
}

export async function genHeaders() {
	return {
		'User-Agent': USER_AGENT,
		'Referer': 'https://space.bilibili.com/',
		'Origin': 'https://space.bilibili.com/',
		'Cookie': await cookie.get(),
	};
}
