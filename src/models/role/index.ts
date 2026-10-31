/**
 * 初始化角色数据
 *
 * @param createdAt 创建时间
 * @param count 生成角色数量
 *
 * @returns 无内容
 */
async function initRole(createdAt: string): Promise<void> {
	const menuList = await menuTable.toArray().then((res) => res.map((item) => item.id));
	const permissionList = await permissionTable.toArray().then((res) => res.map((item) => item.id));

	const roleList: Omit<Role, PrimaryKey>[] = [
		{
			createdAt,
			status: true,
			name: "超级管理员",
			menus: menuList,
			permissions: permissionList,
		},
		{
			createdAt,
			status: true,
			name: "商品采购",
			menus: [1],
			permissions: [],
		},
		{
			createdAt,
			status: true,
			name: "仓储物流",
			menus: [1],
			permissions: [],
		},
		{
			createdAt,
			status: true,
			name: "财务核算",
			menus: [1],
			permissions: [],
		},
	];

	await roleTable.bulkAdd(roleList);
}

export { initRole };
