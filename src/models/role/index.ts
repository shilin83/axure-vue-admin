interface Role extends BaseModel {
	name: string;
	menus: number[];
	permissions: number[];
}

/**
 * 初始角色数据
 *
 * @param createdAt 创建时间
 * @param count 生成角色数量
 *
 * @returns 无内容
 */
async function initRole(createdAt: number): Promise<void> {
	const menus = await menuTable.toArray().then((res) => res.map((item) => item.id));
	const permissions = await permissionTable.toArray().then((res) => res.map((item) => item.id));

	await roleTable.add({
		menus,
		permissions,
		createdAt,
		name: "超级管理员",
		status: true,
	});
}

export type { Role };
export { initRole };
