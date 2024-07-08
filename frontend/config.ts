/// <reference path="./type.ts" />

const BILI_FILE = 'bili.json'

function isObject(o: any): o is { [key: string]: any } {
	return typeof o === 'object' && o !== null && !Array.isArray(o);
}

/**
 * 检查 bili 类型并查重，并就地更新 mid2name ，返回 bili
 */
async function get_ups(mid2name: { [mid: Mid]: string }): Promise<Groups<Up[]>> {
	const resource = await fetch(BILI_FILE).catch(error => {
		error.toString = () => `fetch ${BILI_FILE} 失败`;
		throw error;
	});
	const bili = await resource.json().catch(error => {
		error.toString = () => `解析 ${BILI_FILE} 文件失败`;
		throw error;
	});
	if (!isObject(bili))
		throw `${BILI_FILE} 应该被解析为一个对象/字典`;
	for (let key in bili) {
		const ups = bili[key];
		if (!Array.isArray(ups)) throw `每个键的值应为数组，但 ${key} 的键不是`;
		for (let i = 0; i < ups.length; ++i) {
			const up = ups[i];
			if (!isObject(up))
				throw `${key} 分组下第 ${i + 1} 个条目不为对象/字典`;
			const mid = up['mid'];
			if (typeof mid !== 'number' && typeof mid !== 'string')
				throw `${key} 分组下第 ${i + 1} 个条目的 mid 属性不为 number 或 string`;
			const name = up['name'];
			if (typeof name !== 'string')
				throw `${key} 分组下第 ${i + 1} 的 name 属性不为 string`;
			if (mid2name[mid] !== undefined)
				throw `${key} 分组下第 ${i + 1} 个条目 “${name}” 和之前的 “${mid2name[mid]}” mid ${mid} 重复`;
			mid2name[mid] = name;
		}
	}
	return bili;
}
