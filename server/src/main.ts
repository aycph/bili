import * as fs from 'fs';

import { Response, Server, respond } from './server';
import { genHeader } from './header';

const DEFAULT_URL = '/index.html';

const API_BASE = '/api';
const CONFIG_BASE = '/config';
const DEFAULT_DIR = './public';

const PORT = process.argv[2] === undefined ? 8000 : parseInt(process.argv[2]);

function proxy(server: Server, url: string) {
	const index = url.lastIndexOf('/');
	const pattern = API_BASE + url.substring(index);
	const prefix = url.substring(0, index);
	const matcher = (url: string) => url.startsWith(pattern);
	const handler = async (url: string, res: Response) => {
		const _url = prefix + url.substring(API_BASE.length);
		try {
			const _res = await fetch(_url, { headers: await genHeader() });
			const body = new Uint8Array(await _res.arrayBuffer());
			respond(res, _res.status, body, url);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			respond(res, 503, message, url);
			console.error(err);
		}
	}
	server.addRoute(matcher, handler);
}

function respondFile(res: Response, path: string, url: string) {
	fs.readFile(path, (err, data) => {
		if (err) respond(res, 404, err.message, url);
		else respond(res, 200, data, url);
	});
}

const server = new Server();

proxy(server, 'https://api.bilibili.com/x/space/wbi/arc/search');
proxy(server, 'https://api.bilibili.com/x/space/wbi/acc/info');
proxy(server, 'https://api.bilibili.com/x/web-interface/nav');
server.addRoute(
	'/exit',
	(url, res) => {
		respond(res, 204, null, url);
		server.close();
	}
);
server.addRoute(
	url => url.startsWith(CONFIG_BASE),
	(url, res) => respondFile(res, '.' + url, url)
);
server.addRoute(
	() => true,
	(url, res) => respondFile(res, DEFAULT_DIR + (url === '/' ? DEFAULT_URL : url), url)
);

server.listen(PORT, () => console.log('Server listening on port', PORT));
