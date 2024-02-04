import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';

const DEFAULT_URL = '/index.html';
const API_BASE = '/api';

const PORT = 8001;

const HEADERS = {
	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54',
	'Cookie': 'buvid3=C3438A47-0619-3F91-9696-26D307C9142008714infoc;'
};

type Chunk = string | Buffer | null;

function make_res<
	Response extends http.ServerResponse = http.ServerResponse
>(res: Response, statusCode: number, data: Chunk, route: string, headers?: http.OutgoingHttpHeaders | http.OutgoingHttpHeader[]): void {
	res.writeHead(statusCode, headers);
	console.log(statusCode, route);
	res.end(data);
}

class Route {
	protected static routingTable: Route[] = [];

	protected readonly route: string;
	protected readonly test: (url: string) => boolean;
	protected readonly timeInterval: number;

	public constructor(route: string, test?: (url: string) => boolean) {
		this.route = route;
		if (test !== undefined) {
			this.test = test;
		} else {
			const pattern = route.substring(route.lastIndexOf('/'))
			this.test = url => {
				const split = url.lastIndexOf('?');
				return ( split === -1 ? url : url.substring(0, split) ) === pattern;
			};
		}
		Route.routingTable.push(this);
	}

	public static forward<
		Response extends http.ServerResponse = http.ServerResponse
	>(route: string, res: Response): void {
		for (let routeEntry of Route.routingTable) {
			if (!routeEntry.test(route)) continue;
			let url = routeEntry.route;
			const split = route.lastIndexOf('?');
			if (split !== -1) url += route.substring(split);
			https.get(
				url,
				{ headers: HEADERS },
				i_res => {
					const id = setInterval(console.error, 5000, 'still waiting: ' + url);
					res.writeHead(i_res.statusCode!, i_res.headers);
					console.log(i_res.statusCode, API_BASE + route);
					let content = '';
					i_res.on('data', data => content += data);
					i_res.on('end', () => { res.end(content); clearInterval(id); });
				}
			).on('error', err => {
				make_res(res, 503, err.message, API_BASE + route);
				console.error(err);
			});
			return;
		}
		make_res(res, 404, 'CPH: No such route', API_BASE + route);
	}
}

new Route('https://api.bilibili.com/x/space/wbi/arc/search');
new Route('https://api.bilibili.com/x/space/wbi/acc/info');
new Route('https://api.bilibili.com/x/web-interface/nav');

const server = http.createServer((req, res) => {
	const route = req.url! === '/' ? DEFAULT_URL : req.url!;

	if (route === '/exit') {
		make_res(res, 304, null, route);
		server.close();
		return;
	}
	if (route.startsWith(API_BASE))
		return Route.forward(route.substring(API_BASE.length), res);
	const path = (route === '/bili.json' ? '..' : '.') + route;
	return fs.readFile(path, (err, data) => {
			if (err) make_res(res, 404, err.message, route);
			else make_res(res, 200, data, route);
		});
});

server.listen(PORT, () => console.log('Server listening on port', PORT));
