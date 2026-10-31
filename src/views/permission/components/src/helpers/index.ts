const COLUMN_PERMISSION = {
	KEY: {
		PARENT_ID: "parentId",
	},
	LABEL: {
		PARENT_ID: "父权限",
	},
	EXIST: {
		CODE: "权限标识已存在",
		NAME: "权限名称已存在",
	},
};

const INITIAL_PERMISSION: Permission = {
	id: 0,
	parentId: 0,
	code: "" as PermissionCode,
	name: "",
	createdAt: "",
	updatedAt: "",
};

/**
 * 判断字段值是否已存在
 *
 * @param field 字段名
 * @param value 字段值
 *
 * @returns 存在返回 true，不存在返回 false
 */
async function fieldExist(
	field: typeof TABLE_COLUMN.KEY.CODE | typeof TABLE_COLUMN.KEY.NAME,
	value: string,
): Promise<boolean> {
	return (await permissionTable.where(field).equals(value).count()) > 0;
}

/**
 * 获取已分配的权限 ID 列表
 *
 * @returns 已分配权限 ID 数组
 */
async function assignedPermission(): Promise<number[]> {
	return (await roleTable.orderBy("permissions").uniqueKeys()) as number[];
}

/**
 * 新增权限
 *
 * @param data 权限数据
 *
 * @returns 新增结果响应
 */
async function createPermission(data: Omit<Permission, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		if (await fieldExist(TABLE_COLUMN.KEY.CODE, data.code)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_PERMISSION.EXIST.CODE;
		} else if (await fieldExist(TABLE_COLUMN.KEY.NAME, data.name)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_PERMISSION.EXIST.NAME;
		} else {
			await permissionTable.add(data);

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
 * 更新权限
 *
 * @param id 权限 ID
 * @param data 权限数据
 *
 * @returns 更新结果响应
 */
async function updatePermission(id: number, data: Omit<Permission, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		const existing = await permissionTable.get(id);
		if (existing !== undefined) {
			if ((await fieldExist(TABLE_COLUMN.KEY.CODE, data.code)) && existing.code !== data.code) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = COLUMN_PERMISSION.EXIST.CODE;
			} else if ((await fieldExist(TABLE_COLUMN.KEY.NAME, data.name)) && existing.name !== data.name) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = COLUMN_PERMISSION.EXIST.NAME;
			} else {
				await permissionTable.update(id, data);

				result.code = HTTP_CODE.NO_CONTENT;
				result.message = RESPONSE_MESSAGE.UPDATE;
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
 * 删除权限
 *
 * @param id 权限 ID
 *
 * @returns 删除结果响应
 */
async function deletePermission(id: number): Promise<ResponseApi> {
	const result = responseData();

	try {
		await permissionTable.delete(id);

		result.code = HTTP_CODE.NO_CONTENT;
		result.message = RESPONSE_MESSAGE.DELETE;
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
	}

	return result;
}

export {
	COLUMN_PERMISSION,
	INITIAL_PERMISSION,
	assignedPermission,
	createPermission,
	deletePermission,
	updatePermission,
};
