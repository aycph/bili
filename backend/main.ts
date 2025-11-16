import * as fs from 'fs';

import { Response, Server, respond } from './server';
import { genHeader } from './header';

const DEFAULT_URL = '/index.html';
const API_BASE = '/api';

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
	() => true,
	(url, res) => fs.readFile(
		(url === '/bili.json' ? '..' : '.') + (url === '/' ? DEFAULT_URL : url),
		(err, data) => {
			if (err) respond(res, 404, err.message, url);
			else respond(res, 200, data, url);
		}
	)
);

server.listen(PORT, () => console.log('Server listening on port', PORT));
