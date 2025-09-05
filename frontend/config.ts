/// <reference path="./type.ts" />

const BILI_FILE = 'bili.json';

function isObject(o: any): o is { [key: string]: any } {
	return typeof o === 'object' && o !== null && !Array.isArray(o);
}

/**
 * 检查 bili 类型并查重，并就地更新 mid2name ，返回 bili
 * 而且 tags 模式显然具有更大潜力，因此返回结果总为 tags 形式
 */
async function get_ups(mid2name: { [mid: Mid]: string }): Promise<Bili> {
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

	const type = bili['type'];
	if (type === 'groups') {
		const groups = bili['groups'];
		if (!isObject(bili))
			throw `groups 字段不为对象/字典`;
		const ret: Bili = {
			"tags": Object.keys(groups),
			"ups": []
		};
		for (let tag in groups) {
			const ups = groups[tag];
			if (!Array.isArray(ups)) throw `groups 中每个键的值应为数组，但 ${tag} 的键不是`;
			for (let i = 0; i < ups.length; ++i) {
				const up = ups[i];
				if (!isObject(up))
					throw `${tag} 分组下第 ${i + 1} 个条目不为对象/字典`;
				const mid = up['mid'];
				if (typeof mid !== 'number' && typeof mid !== 'string')
					throw `${tag} 分组下第 ${i + 1} 个条目的 mid 属性不为 number 或 string`;
				const name = up['name'];
				if (typeof name !== 'string')
					throw `${tag} 分组下第 ${i + 1} 的 name 属性不为 string`;
				if (mid2name[mid] !== undefined)
					throw `${tag} 分组下第 ${i + 1} 个条目 “${name}” 和之前的 “${mid2name[mid]}” mid ${mid} 重复`;
				mid2name[mid] = name;
				ret['ups'].push({ name, mid, tags: [tag] });
			}
		}
		return ret;
	} else if (type === 'tags') {
		const tags = bili['tags'];
		if (!Array.isArray(tags))
			throw 'tags 字段的值应为数组';
		for (let i = 0; i < tags.length; ++i) {
			if (typeof tags[i] !== 'string')
				throw `tags 的第 ${i + 1} 个元素不为字符串`;
		}
		const tags_set: Set<string> = new Set(tags);

		const ups = bili['ups'];
		if (!Array.isArray(ups)) throw 'ups 字段的值应为数组';
		for (let i = 0; i < ups.length; ++i) {
			const up = ups[i];
			if (!isObject(up))
				throw `ups 的第 ${i + 1} 个元素不为对象/字典`;
			const mid = up['mid'];
			if (typeof mid !== 'number' && typeof mid !== 'string')
				throw `ups 分组下第 ${i + 1} 个元素的 mid 类型不为 number 或 string`;
			const name = up['name'];
			if (typeof name !== 'string')
				throw `ups 分组下第 ${i + 1} 个元素的 name 类型不为 string`;
			const tags = up['tags'];
			if (!Array.isArray(tags))
				throw `ups 分组下第 ${i + 1} 个元素的 tags 不为数组`;
			for (let tag of tags) {
				if (!tags_set.has(tag))
					throw `ups 分组下第 ${i + 1} 个元素的 tags 中有未记录的值`;
			}
			if (mid2name[mid] !== undefined)
				throw `ups 分组下第 ${i + 1} 个元素的 “${name}” 和之前的 “${mid2name[mid]}” mid ${mid} 重复`;
			mid2name[mid] = name;
		}

		return bili as Bili;
	} else {
		throw `type 属性只能为 "groups" 或 "tags"`;
	}
}
