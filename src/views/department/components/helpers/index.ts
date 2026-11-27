const NAME_EXIST = "部门名称已存在";

const INITIAL_DEPARTMENT: Department = {
	id: 0,
	name: "",
	status: true,
};

const COLUMN_DEPARTMENT = {
	KEY: {
		NAME: "name",
	},
	LABEL: {
		NAME: "部门名称",
	},
} as const;

/**
 * 判断字段值是否已存在
 *
 * @param field 字段名
 * @param value 字段值
 *
 * @returns 存在返回 true，不存在返回 false
 */
async function fieldExist(field: (typeof COLUMN_DEPARTMENT.KEY)["NAME"], value: string): Promise<boolean> {
	return (await departmentTable.where(field).equals(value).count()) > 0;
}

/**
 * 获取已分配的部门 ID 列表
 *
 * @returns 已分配部门 ID 数组
 */
async function assignedDepartment(): Promise<number[]> {
	return (await userTable.orderBy("department").uniqueKeys()) as number[];
}

/**
 * 新增部门
 *
 * @param data 部门数据
 *
 * @returns 新增结果响应
 */
async function createDepartment(data: Omit<Department, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		if (await fieldExist(COLUMN_DEPARTMENT.KEY.NAME, data.name)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = NAME_EXIST;
		} else {
			await departmentTable.add(data);

			result.code = HTTP_CODE.CREATED;
			result.message = RESPONSE_MESSAGE.CREATED;
		}
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER_ERROR;
	}

	return result;
}

/**
 * 更新部门
 *
 * @param id 部门 ID
 * @param data 部门数据
 *
 * @returns 更新结果响应
 */
async function updateDepartment(id: number, data: boolean | Omit<Department, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		const existing = await departmentTable.get(id);
		if (existing === undefined) {
			result.code = HTTP_CODE.NOT_FOUND;
			result.message = RESPONSE_MESSAGE.NOT_FOUND;
		} else {
			if (typeof data === "boolean") {
				await departmentTable.update(id, {
					status: data,
					updatedAt: currentUnix(),
				});
				result.code = HTTP_CODE.NO_CONTENT;
			} else if ((await fieldExist(COLUMN_DEPARTMENT.KEY.NAME, data.name)) && existing.name !== data.name) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = NAME_EXIST;
			} else {
				await departmentTable.update(id, data);

				result.code = HTTP_CODE.NO_CONTENT;
				result.message = RESPONSE_MESSAGE.UPDATED;
			}
		}
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER_ERROR;
	}

	return result;
}

/**
 * 删除部门
 *
 * @param id 部门 ID
 *
 * @returns 删除结果响应
 */
async function deleteDepartment(id: Arrayable<number>): Promise<ResponseApi> {
	const result = responseData();

	try {
		if (typeof id === "number") {
			await departmentTable.delete(id);
		} else {
			await departmentTable.bulkDelete(id);
		}

		result.code = HTTP_CODE.NO_CONTENT;
		result.message = typeof id === "number" ? RESPONSE_MESSAGE.DELETED : RESPONSE_MESSAGE.BATCH_DESTROY;
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER_ERROR;
	}

	return result;
}

export {
	INITIAL_DEPARTMENT,
	COLUMN_DEPARTMENT,
	assignedDepartment,
	createDepartment,
	updateDepartment,
	deleteDepartment,
};
