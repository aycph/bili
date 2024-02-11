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
