import { isBoolean, isString } from "es-toolkit/predicate";

const COLUMN_DEPARTMENT = {
	EXIST: {
		NAME: "部门名称已存在",
	},
};

const INITIAL_DEPARTMENT: Department = {
	id: 0,
	name: "",
	createdAt: "",
	updatedAt: "",
	status: true,
};

/**
 * 判断字段值是否已存在
 *
 * @param field 字段名
 * @param value 字段值
 *
 * @returns 存在返回 true，不存在返回 false
 */
async function fieldExist(field: typeof TABLE_COLUMN.KEY.NAME, value: string): Promise<boolean> {
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
		if (await fieldExist(TABLE_COLUMN.KEY.NAME, data.name)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_DEPARTMENT.EXIST.NAME;
		} else {
			await departmentTable.add(data);

			result.code = HTTP_CODE.CREATED;
			result.message = RESPONSE_MESSAGE.CREATE;
		}
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
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
async function updateDepartment(
	id: number,
	data: boolean | string | Omit<Department, PrimaryKey>,
): Promise<ResponseApi> {
	const result = responseData();

	try {
		const existing = await departmentTable.get(id);
		if (existing !== undefined) {
			if (isBoolean(data)) {
				await departmentTable.update(id, {
					status: !data,
					updatedAt: currentTime(),
				});
				result.code = HTTP_CODE.NO_CONTENT;
			} else if (isString(data)) {
				await departmentTable.update(id, {
					deletedAt: data !== "" ? data : undefined,
				});
				result.code = HTTP_CODE.NO_CONTENT;
				result.message = data !== "" ? RESPONSE_MESSAGE.DELETE : RESPONSE_MESSAGE.RESTORE;
			} else {
				if ((await fieldExist(TABLE_COLUMN.KEY.NAME, data.name)) && existing.name !== data.name) {
					result.code = HTTP_CODE.BAD_REQUEST;
					result.message = COLUMN_DEPARTMENT.EXIST.NAME;
				} else {
					await departmentTable.update(id, data);

					result.code = HTTP_CODE.NO_CONTENT;
					result.message = RESPONSE_MESSAGE.UPDATE;
				}
			}
		} else {
			result.code = HTTP_CODE.NOT_FOUND;
			result.message = RESPONSE_MESSAGE.NOT_FOUND;
		}
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
	}

	return result;
}

/**
 * 批量删除/清空部门
 *
 * @param ids 部门 ID 数组
 * @param clear 是否清空部门
 *
 * @returns 删除结果响应
 */
async function deleteDepartment(ids: number[], clear: boolean = false): Promise<ResponseApi> {
	const result = responseData();

	try {
		await departmentTable.bulkDelete(ids);

		result.code = HTTP_CODE.NO_CONTENT;
		result.message = clear ? RESPONSE_MESSAGE.CLEAR : RESPONSE_MESSAGE.BATCH_DESTROY;
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
	}

	return result;
}

export {
	COLUMN_DEPARTMENT,
	INITIAL_DEPARTMENT,
	assignedDepartment,
	createDepartment,
	deleteDepartment,
	updateDepartment,
};
