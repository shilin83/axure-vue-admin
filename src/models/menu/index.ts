/**
 * 初始化菜单数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initMenu(createdAt: string): Promise<void> {
	const menuList: Omit<Menu, PrimaryKey>[] = [
		{
			createdAt,
			parentId: 0,
			code: ROUTE_KEY.HOME,
			name: ROUTE_PATH[ROUTE_KEY.HOME],
			icon: "flagpack:fr",
		},
		{
			createdAt,
			parentId: 0,
			code: ROUTE_KEY.SYSTEM,
			name: ROUTE_PATH[ROUTE_KEY.SYSTEM],
			icon: "flagpack:ar",
		},
		{
			createdAt,
			parentId: 2,
			code: ROUTE_KEY.USER,
			name: ROUTE_PATH[ROUTE_KEY.USER],
			icon: "flagpack:de",
		},
		{
			createdAt,
			parentId: 2,
			code: ROUTE_KEY.DEPARTMENT,
			name: ROUTE_PATH[ROUTE_KEY.DEPARTMENT],
			icon: "flagpack:br",
		},
		{
			createdAt,
			parentId: 2,
			code: ROUTE_KEY.ROLE,
			name: ROUTE_PATH[ROUTE_KEY.ROLE],
			icon: "flagpack:es",
		},
		{
			createdAt,
			parentId: 2,
			code: ROUTE_KEY.PERMISSION,
			name: ROUTE_PATH[ROUTE_KEY.PERMISSION],
			icon: "flagpack:it",
		},
		{
			createdAt,
			parentId: 2,
			code: ROUTE_KEY.MENU,
			name: ROUTE_PATH[ROUTE_KEY.MENU],
			icon: "flagpack:nl",
		},
	];

	await menuTable.bulkAdd(menuList);
}

export { initMenu };
