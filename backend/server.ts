import * as http from 'http';

export type Request = http.IncomingMessage;
export type Response = http.ServerResponse & { req: Request };

export type RouteMatcher = (url: string) => boolean;
export type RouteHandler = (url: string, res: Response) => void;

export function respond(
	res: Response,
	statusCode: number,
	body: string | Buffer | Uint8Array | null,
	info?: any,
	headers?: Parameters<Response['writeHead']>[1],
): void {
	res.writeHead(statusCode, headers);
	console.log(statusCode, info);
	res.end(body);
}

export class Server {
	protected readonly server: http.Server;
	protected readonly routes: [RouteMatcher, RouteHandler][];
	constructor() {
		this.server = http.createServer(this.requestListener.bind(this));
		this.routes = [];
	}
	protected requestListener(req: Request, res: Response): void {
		const url = req.url;
		if (url === undefined)
			return respond(res, 400, 'CPH: Undefined url', 'undefined...?');
		for (const [matcher, handler] of this.routes)
			if (matcher(url))
				return handler(url, res);
		return respond(res, 404, 'CPH: Not Found', url);
	}
	listen(port?: number, listeningListener?: () => void): this {
		this.server.listen(port, listeningListener);
		return this;
	}
	close(callback?: (err?: Error) => void): void {
		this.server.close(callback);
	}
	addRoute(matcher: string | RegExp | RouteMatcher, handler: RouteHandler): this {
		if (typeof matcher === 'string')
			this.routes.push([url => url === matcher, handler]);
		else if (matcher instanceof RegExp)
			this.routes.push([url => matcher.test(url), handler]);
		else
			this.routes.push([matcher, handler]);
		return this;
	}
}
