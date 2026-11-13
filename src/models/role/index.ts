interface Role extends BaseModel {
	name: string;
	menus: number[];
	permissions: number[];
	status: boolean;
}

/**
 * 初始角色数据
 *
 * @param createdAt 创建时间
 * @param count 生成角色数量
 *
 * @returns 无内容
 */
async function initRole(createdAt: string): Promise<void> {
	const status = true;
	const list = ["超级管理员", "运营专员", "采购专员", "财务专员"];
	const menus = await menuTable.toArray().then((res) => res.map((item) => item.id));
	const permissions = await permissionTable.toArray().then((res) => res.map((item) => item.id));

	await roleTable.bulkAdd(
		list.map((name, index) => ({
			createdAt,
			name,
			status,
			menus: index === 0 ? menus : [1],
			permissions: index === 0 ? permissions : [],
		})),
	);
}

export type { Role };
export { initRole };
