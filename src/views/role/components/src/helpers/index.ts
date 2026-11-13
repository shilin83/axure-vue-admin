import { isBoolean, isNumber } from "es-toolkit/predicate";

const INITIAL_ROLE: Role = {
	id: 0,
	name: "",
	createdAt: "",
	updatedAt: "",
	status: true,
	menus: [],
	permissions: [],
};

const COLUMN_ROLE = {
	KEY: {
		MENU: "menus",
		PERMISSION: "permissions",
	},
	LABEL: {
		MENU: "菜单",
		PERMISSION: "权限",
	},
	EXIST: {
		NAME: "角色名称已存在",
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
async function fieldExist(field: (typeof TABLE_COLUMN.KEY)["NAME"], value: string): Promise<boolean> {
	return (await roleTable.where(field).equals(value).count()) > 0;
}

/**
 * 获取已分配的角色 ID 列表
 *
 * @returns 已分配的角色 ID 数组
 */
async function assignedRole(): Promise<number[]> {
	return (await userTable.orderBy("roles").uniqueKeys()) as number[];
}

/**
 * 新增角色
 *
 * @param data 角色数据
 *
 * @returns 新增结果响应
 */
async function createRole(data: Omit<Role, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		if (await fieldExist(TABLE_COLUMN.KEY.NAME, data.name)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_ROLE.EXIST.NAME;
		} else {
			await roleTable.add(data);

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
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 *
 * @returns 更新结果响应
 */
async function updateRole(id: number, data: boolean | Omit<Role, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		const existing = await roleTable.get(id);
		if (existing === undefined) {
			result.code = HTTP_CODE.NOT_FOUND;
			result.message = RESPONSE_MESSAGE.NOT_FOUND;
		} else {
			if (isBoolean(data)) {
				await roleTable.update(id, {
					status: data,
				});
				result.code = HTTP_CODE.NO_CONTENT;
			} else if ((await fieldExist(TABLE_COLUMN.KEY.NAME, data.name)) && existing.name !== data.name) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = COLUMN_ROLE.EXIST.NAME;
			} else {
				await roleTable.update(id, data);

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
 * 删除角色
 *
 * @param id 角色 ID
 *
 * @returns 删除结果响应
 */
async function deleteRole(id: Arrayable<number>): Promise<ResponseApi> {
	const result = responseData();

	try {
		if (isNumber(id)) {
			await roleTable.delete(id);
		} else {
			await roleTable.bulkDelete(id);
		}

		result.code = HTTP_CODE.NO_CONTENT;
		result.message = isNumber(id) ? RESPONSE_MESSAGE.DELETED : RESPONSE_MESSAGE.BATCH_DESTROY;
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER_ERROR;
	}

	return result;
}

export { INITIAL_ROLE, COLUMN_ROLE, assignedRole, createRole, updateRole, deleteRole };
