function createElements<K extends (keyof HTMLElementTagNameMap)[]>(innerHTML: string) {
	const elem = document.createElement('body');
	elem.innerHTML = innerHTML;
	return elem.children as { [_K in keyof K]: HTMLElementTagNameMap[K[_K]] };
}

function createElement<K extends keyof HTMLElementTagNameMap>(innerHTML: string) {
	const elems = createElements<[K]>(innerHTML);
	if (elems.length !== 1) throw 'CPH: 调用 createElement 时需保证 innerHTML 仅有一个元素';
	return elems[0];
}

function objectMap<
	O extends object,
	F extends <K extends keyof O>(key: K, value: O[K], index: number) => unknown,
>(obj: O, func: F): {
	[K in keyof O]: ReturnType<F>
} {
	// @ts-ignore 不必在意，只能假设 F 返回的类型相同了……
	return Object.fromEntries(Object.entries(obj).map(([key, value], index) => [key, func(key, value, index)]))
}
