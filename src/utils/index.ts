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
 * 格式化当前时间
 *
 * @param format 当前时间格式
 *
 * @returns 格式化后的当前时间字符串
 */
function currentTime(format: string = "YYYY-MM-DD HH:mm:ss"): string {
	return dayjs().format(format);
}

/**
 * 跳转页面
 *
 * @param key 路由键
 *
 * @returns 无内容
 */
function redirectPage(key: MenuKey): void {
	if (Object.values(MENU_KEY).includes(key))
		if (import.meta.env.DEV) window.location.href = `/${key}/`;
		else {
			const dom = document.querySelector('[data-label="page"] input');
			if (dom !== null && dom instanceof HTMLInputElement) {
				dom.value = MENU_PATH[key];
				dom.dispatchEvent(
					new Event("input", {
						bubbles: true,
					}),
				);
			} else console.error("DOM 不存在！");
		}
	else useNotification().warning("暂未开放，敬请期待！");
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

		if (item[parentId] === 0) prev.push(item);
		else {
			const parent = map.get(item[parentId]);
			if (parent === undefined) prev.push(item);
			else parent[childrenKey].push(item);
		}

		return prev;
	}, []);
}

/**
 * 过滤状态文本
 *
 * @returns 状态文本数组
 */
function filterStatus(): {
	text: (typeof STATUS_TEXT)[keyof typeof STATUS_TEXT];
	value: boolean;
}[] {
	return Object.values([true, false]).map((value) => ({
		text: value ? STATUS_TEXT.ENABLED : STATUS_TEXT.DISABLED,
		value,
	}));
}

export { buildTree, createRoot, currentTime, redirectPage, filterStatus };
