const CODE_EXIST = "权限标识已存在";
const NAME_EXIST = "权限名称已存在";

const INITIAL_PERMISSION: Permission = {
	id: 0,
	parentId: 0,
	code: "" as PermissionCode,
	name: "",
};

const COLUMN_PERMISSION = {
	KEY: {
		CODE: "code",
		NAME: "name",
		PARENT: "parentId",
	},
	LABEL: {
		CODE: "权限标识",
		NAME: "权限名称",
		PARENT: "父级权限",
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
async function fieldExist(field: (typeof COLUMN_PERMISSION.KEY)["CODE" | "NAME"], value: string): Promise<boolean> {
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
		if (await fieldExist(COLUMN_PERMISSION.KEY.CODE, data.code)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = CODE_EXIST;
		} else if (await fieldExist(COLUMN_PERMISSION.KEY.NAME, data.name)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = NAME_EXIST;
		} else {
			await permissionTable.add(data);

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
		if (existing === undefined) {
			result.code = HTTP_CODE.NOT_FOUND;
			result.message = RESPONSE_MESSAGE.NOT_FOUND;
		} else {
			if ((await fieldExist(COLUMN_PERMISSION.KEY.CODE, data.code)) && existing.code !== data.code) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = CODE_EXIST;
			} else if ((await fieldExist(COLUMN_PERMISSION.KEY.NAME, data.name)) && existing.name !== data.name) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = NAME_EXIST;
			} else {
				await permissionTable.update(id, data);

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
		result.message = RESPONSE_MESSAGE.DELETED;
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER_ERROR;
	}

	return result;
}

export {
	INITIAL_PERMISSION,
	COLUMN_PERMISSION,
	assignedPermission,
	createPermission,
	updatePermission,
	deletePermission,
};
