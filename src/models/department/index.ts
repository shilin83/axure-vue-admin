interface Department extends BaseModel {
	name: string;
	status: boolean;
}

/**
 * 初始部门数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initDepartment(createdAt: string): Promise<void> {
	const status = true;
	const list = ["技术部", "运营部", "采购部", "财务部"];

	await departmentTable.bulkAdd(
		list.map((name) => ({
			createdAt,
			name,
			status,
		})),
	);
}

export type { Department };
export { initDepartment };
