import dayjs from "dayjs";
import { upperFirst } from "es-toolkit/string";

/**
 * 创建应用根节点
 *
 * @returns 根节点 DOM 元素
 */
function createRoot(): HTMLElement {
	const el = document.createElement("div");

	el.id = "app";
	document.body.appendChild(el);

	return el;
}

/**
 * 获取当前时间戳
 *
 * @returns Unix 时间戳
 */
function currentUnix(): number {
	return dayjs().unix();
}

/**
 * 格式化 Unix 时间戳
 *
 * @param timestamp Unix 时间戳
 *
 * @returns 格式化后的时间字符串
 */
function formatUnix(timestamp: number, format: string = "YYYY-MM-DD HH:mm:ss"): string {
	return dayjs.unix(timestamp).format(format);
}

/**
 * 将字符串的第一个字符转换为大写
 *
 * @param str 输入字符串
 *
 * @returns 大写后的字符串
 */
function firstUpper(str: string): string {
	return upperFirst(str);
}

/**
 * 过滤状态文本
 *
 * @returns 状态文本数组
 */
function filterStatus(): {
	value: boolean;
	text: (typeof STATUS_TEXT)[number];
}[] {
	return Object.values([true, false]).map((value) => ({
		value,
		text: value ? STATUS_TEXT[0] : STATUS_TEXT[1],
	}));
}

/**
 * 跳转页面
 *
 * @param key 路由键
 *
 * @returns 无内容
 */
function redirectPage(key: MenuKey): void {
	if (!Object.values(MENU_KEY).includes(key)) {
		useNotification().warning("暂未开放，敬请期待！");
		return;
	}

	if (import.meta.env.DEV) {
		window.location.href = `/${key}/`;
	} else {
		const dom = document.querySelector('[data-label="page"] input');
		if (dom !== null && dom instanceof HTMLInputElement) {
			dom.value = MENU_PATH[key];
			dom.dispatchEvent(
				new Event("input", {
					bubbles: true,
				}),
			);
		} else {
			throw new Error("DOM 不存在！");
		}
	}
}

/**
 * 一维数组转树形结构：将扁平化的列表根据父级引用组装为树，父级缺失的节点作为根节点
 *
 * @param items 数据列表
 * @param idKey 主键字段名，默认 id
 * @param parentId 父级字段名，默认 parentId
 * @param childrenKey 子级字段名，默认 children
 *
 * @returns 树形结构数组
 */
function buildTree<T extends Recordable<any>>(
	items: T[],
	idKey: PrimaryKey = TABLE_COLUMN.KEY.ID,
	parentId: keyof T = "parentId",
	childrenKey: keyof T = "children",
): T[] {
	if (items.length === 0) return [];

	const map = new Map<PrimaryKey, T>(
		items.map((item) => {
			const id = item[idKey];
			if (childrenKey === undefined)
				return [
					id,
					{
						...item,
					},
				] as const;

			return [
				id,
				{
					...item,
					[childrenKey]: [],
				},
			] as const;
		}),
	);

	return items.reduce<T[]>((prev, curr) => {
		const item = map.get(curr[idKey]);
		if (item === undefined) return prev;

		if (item[parentId] === 0) {
			prev.push(item);
		} else {
			const parent = map.get(item[parentId]);
			if (parent === undefined) {
				prev.push(item);
			} else {
				parent[childrenKey].push(item);
			}
		}

		return prev;
	}, []);
}

export { dayjs, createRoot, currentUnix, formatUnix, firstUpper, filterStatus, redirectPage, buildTree };
