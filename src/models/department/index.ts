/**
 * 初始化部门数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initDepartment(createdAt: string): Promise<void> {
	const departmentList: Omit<Department, PrimaryKey>[] = [
		{
			createdAt,
			status: true,
			name: "技术部",
		},
		{
			createdAt,
			status: true,
			name: "采购部",
		},
		{
			createdAt,
			status: true,
			name: "仓储物流部",
		},
		{
			createdAt,
			status: true,
			name: "财务部",
		},
	];

	await departmentTable.bulkAdd(departmentList);
}

export { initDepartment };
