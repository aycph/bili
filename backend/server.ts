import http from 'http';
import https from 'https';
import fs from 'fs'

const DEFAULT_URL = '/index.html'
const API_BASE = '/api';

const PORT = 8000;

const HEADER = {
	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54'
}

function make_res(res: http.ServerResponse, statusCode: number, data: any, route: string, headers?: http.OutgoingHttpHeaders | http.OutgoingHttpHeader[]): void {
	res.writeHead(statusCode, headers);
	console.log(statusCode, route);
	res.end(data);
}

class Route {
	static routingTable: Route[] = [];
	static forward(route: string, res: http.ServerResponse): void {
		for (let routeEntry of Route.routingTable) {
			if (!routeEntry.test(route)) continue;
			let url = routeEntry.route;
			const split = route.lastIndexOf('?');
			if (split !== -1) url += route.substring(split);
			let buffer = '';
			https.get(
				url,
				{ headers: HEADER },
				fres => {
					fres.on('data', data => buffer += data);
					fres.on('end', () => make_res(res, fres.statusCode!, buffer, API_BASE + route, fres.headers))
				}
			)
			return;
		}
		make_res(res, 404, 'CPH: No such route', API_BASE + route);
	}
	public readonly route: string;
	public readonly test: (url: string) => boolean;
	constructor(route: string, test?: (url: string) => boolean
	) {
		this.route = route;
		if (test !== undefined) {
			this.test = test;
		} else {
			const pattern = route.substring(route.lastIndexOf('/'))
			this.test = url => {
				const split = url.lastIndexOf('?');
				return ( split === -1 ? url : url.substring(0, split) ) === pattern
			}
		}
		Route.routingTable.push(this);
	}
}

new Route('https://api.bilibili.com/x/space/wbi/arc/search');

const server = http.createServer((req, res) => {
	const route = req.url! === '/' ? DEFAULT_URL : req.url!;

	if (route === '/exit')
		return make_res(res, 304, null, route);
	if (route.startsWith(API_BASE))
		return Route.forward(route.substring(API_BASE.length), res);
	const path = (route === '/bili.json' ? '..' : '.') + route;
	return fs.readFile(path, (err, data) => {
			if (err) make_res(res, 404, err.message, route);
			else make_res(res, 200, data, route);
		})
});

server.addListener('request', (req, res) => {
	if (req.url === '/exit') server.close();
})

server.listen(PORT, () => console.log('Server listening on port', PORT))