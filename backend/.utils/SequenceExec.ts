class SequenceExecutor {
	private pool: [() => Promise<void>, number][];
	private working: boolean;
	constructor() {
		this.pool = [];
		this.working = false;
	}
	private static sleep(timeout: number) {
		return new Promise<void>(resolve => {
			setTimeout(resolve, timeout);
		});
	}
	async exec(request: () => Promise<void>, timeout: number) {
		this.pool.push([request, timeout]);
		if (this.working) return; 
		this.working = true;
		while (this.pool.length) {
			const [request, timeout] = this.pool.shift()!;
			await request();
			await SequenceExecutor.sleep(timeout);
		}
		this.working = false;
	}
}
