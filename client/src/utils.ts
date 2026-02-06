function createElements<Ks extends (keyof HTMLElementTagNameMap)[]>(innerHTML: string) {
	const elem = document.createElement('body');
	elem.innerHTML = innerHTML;
	return elem.children as unknown as { [K in keyof Ks]: HTMLElementTagNameMap[Ks[K]] };
}

function createElement<K extends keyof HTMLElementTagNameMap>(innerHTML: string) {
	const elems = createElements<[K]>(innerHTML);
	if (elems.length !== 1) throw 'CPH: 调用 createElement 时需保证 innerHTML 仅有一个元素';
	return elems[0];
}

/* Unused
function objectMap<
	O extends object,
	F extends <K extends keyof O>(key: K, value: O[K]) => unknown,
>(obj: O, func: F): {
	[K in keyof O]: ReturnType<F>
} {
	// @ts-ignore 不必在意，只能假设 F 返回的类型相同了……
	return Object.fromEntries( Object.entries(obj).map(([key, value]) => [key, func(key, value)]) );
}

async function objectPromiseAll<O extends object>(obj: O): Promise<{
	[K in keyof O]: Awaited<O[K]>
}> {
	const entries1 = Object.entries(obj);
	const entries2 = entries1.map(async ([key, value]) => [key, await value] as [string, any]);
	const entries3 = await Promise.all(entries2);
	// @ts-ignore 总得覆盖了……
	return Object.fromEntries(entries3);
}
*/