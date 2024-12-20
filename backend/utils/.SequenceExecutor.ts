class SequenceExecutor<T> {
	private working: Promise<void>;
	constructor() {
		this.working = Promise.resolve();
	}
	private static sleep(timeout: number) {
		return new Promise<void>(resolve => {
			setTimeout(resolve, timeout);
		});
	}
	exec<U extends T = T>(request: () => Promise<U>, timeout: number): Promise<U> {
		const p = this.working.then(request);
		this.working = p.then(() => SequenceExecutor.sleep(timeout));
		return p;
	}
}
