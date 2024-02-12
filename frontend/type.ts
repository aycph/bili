type Up = {
	name: string,
	mid: number | string // 但不推荐使用 string
};

type Groups<T> = {
	[group: string]: T
};

type SearchItem = {
	comment: number,
	typeid: number,
	play: number,
	pic: string, // URL
	subtitle: string,
	description: string,
	title: string,
	author: string,
	mid: number,
	created: number,
	length: string,
	video_review: number,
	aid: number,
	bvid: string,
	meta: null | {
		id: number,
		title: string,
		cover: string, // 作者 URL,
		mid: number,
		intro: string,
		stat: {
			season_id: number,
			view: number,
			danmaku: number,
			reply: number,
			favorite: number,
			coin: number,
			share: number,
			like: number
		},
		ep_count: number,
		first_aid: number,
		ptime: number,
		ep_num: number
	}
};

type Search = {
	code: 0,
	message: string,
	data: {
		list: {
			vlist: SearchItem[],
		},
		page: {
			pn: number,
			ps: number,
			count: number
		},
		episodic_button: {
			text: string, // "播放全部",
			uri: string, // URL
		}
	}
};

type Param = {
	aid: number, // used for sort/deduplication
	bvid: string,
	cover: string,
	views: string,
	danmaku: number,
	duration: string,
	title: string,
	mid: number,
	author: string,
	posttime: string,
	created: number,
};

function play2views(play: number): string {
	if (play < 10000) return play.toString();
	if ((play /= 10000) < 10000) return play.toFixed(1) + '万';
	return (play /= 10000).toFixed(1) + '亿';
}

function created2posttime(created: number): string {
	// 分钟前，小时前，昨天，日期，跨年补年份
	const time = created * 1000;
	const now = Date.now();
	const dtime = new Date(time);
	const dnow = new Date(now);
	const delta = now - time;
	if (delta < 60_000) return '刚刚';
	if (delta < 3600_000) return Math.floor(delta / 60_000) + '分钟前';
	if (delta < 24 * 3600_000) return Math.floor(delta / 3600_000) + '小时前';
	if (dnow.setHours(0,0,0,0) - time < 24 * 3600_000) return '昨天';
	const month = dtime.getMonth() + 1;
	const date = dtime.getDate();
	if (dtime.getFullYear() == dnow.getFullYear()) return `${month}-${date}`;
	return `${dtime.getFullYear()}-${month}-${date}`;
}

function _convert_item({ aid, bvid, pic, play, video_review, length, title, mid, author, created }: SearchItem): Param {
	return {
		aid,
		bvid,
		cover: pic,
		views: play2views(play),
		danmaku: video_review,
		duration: length,
		title,
		mid,
		author,
		posttime: created2posttime(created),
		created,
	};
}

function convert({ data }: Search): Param[] {
	return data['list']['vlist'].map(_convert_item);
}

type Info = {
	code: 0,
	data: {
		mid: number,
		name: string,
		level: number,
		face: string,
		official: {
			title: string
		}
		live_room: null | {
			cover: string, // url
			liveStatus: number,
			// roomStatus: number,
			roomid: number,
			title: string,
			url: string, // url
			watched_show: {
				// ...
			}
		}
	}
};

type LiveParam = {
	mid: number,
	name: string,
	level: number,
	face: string,
	sign: string,
	roomid: number,
	title: string
};

function convert2_live_param({ data }: Info): LiveParam | null {
	const live_room = data['live_room'];
	if (live_room === null || !live_room['liveStatus']) return null;
	return {
		mid: data['mid'],
		name: data['name'],
		level: data['level'],
		face: data['face'],
		sign: data['official']['title'],
		roomid: live_room['roomid'],
		title: live_room['title']
	}
}

type BaseError = {
	code: number,
	message: string
};

type RequestErrors = {
	code: -401,
	message: '非法访问'
} | {
	code: -403,
	message: '访问权限不足'
} | {
	code: -352,
    message: '风控校验失败'
};
