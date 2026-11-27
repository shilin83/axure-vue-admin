interface Department extends BaseModel {
	name: string;
}

/**
 * 初始部门数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initDepartment(createdAt: number): Promise<void> {
	await departmentTable.add({
		createdAt,
		name: "技术部",
		status: true,
	});
}

export type { Department };
export { initDepartment };
