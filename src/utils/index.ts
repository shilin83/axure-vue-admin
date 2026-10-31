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
 * 跳转页面：根据路由键跳转，开发环境直接修改地址，生产环境填充页面输入框并触发事件
 *
 * @param key 路由键
 *
 * @returns 无内容
 */
function redirectPage(key: RouteKey): void {
	if (Object.values(ROUTE_KEY).includes(key))
		if (import.meta.env.DEV) window.location.href = `/${key}/`;
		else {
			const dom = document.querySelector('[data-label="page"] input');
			if (dom !== null && dom instanceof HTMLInputElement) {
				dom.value = ROUTE_PATH[key];
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
 * @param parentIdKey 父级主键字段名，默认 parentId
 * @param childrenKey 子级字段名，默认 children
 *
 * @returns 树形结构数组
 */
function buildTree<T extends Recordable<any>>(
	items: T[],
	idKey: PrimaryKey = TABLE_COLUMN.KEY.ID,
	parentIdKey: keyof T = "parentId",
	childrenKey: keyof T = "children",
): T[] {
	if (items.length === 0) return [];

	const map = new Map<number, T>(
		items.map((item) => [
			item[idKey],
			{
				...item,
				[childrenKey]: [],
			},
		]),
	);

	return items.reduce<T[]>((prev, curr) => {
		const current = map.get(curr[idKey]);
		if (current === undefined) return prev;

		if (current[parentIdKey] === 0) {
			prev.push(current);
		} else {
			const parent = map.get(current[parentIdKey]);
			if (parent !== undefined) {
				parent[childrenKey].push(current);
			}
		}

		return prev;
	}, []);
}

/**
 * 创建请求结果对象
 *
 * @param data 结果数据，缺省为空
 *
 * @returns 包含成功状态码、数据与提示信息的响应对象
 */
function responseData<T = unknown>(data?: T): ResponseApi<T> {
	return {
		code: HTTP_CODE.OK,
		data: data ?? null,
		message: "",
	};
}

export { currentTime, createRoot, redirectPage, buildTree, responseData };
