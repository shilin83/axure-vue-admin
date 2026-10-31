import { isBoolean, isString } from "es-toolkit/predicate";

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
};

const INITIAL_ROLE: Role = {
	id: 0,
	name: "",
	createdAt: "",
	updatedAt: "",
	status: true,
	menus: [],
	permissions: [],
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
	return (await roleTable.where(field).equals(value).count()) > 0;
}

/**
 * 获取已分配的角色 ID 列表
 *
 * @returns 已分配角色 ID 数组
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
			result.message = RESPONSE_MESSAGE.CREATE;
		}
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
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
async function updateRole(id: number, data: boolean | string | Omit<Role, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		const existing = await roleTable.get(id);
		if (existing !== undefined) {
			if (isBoolean(data)) {
				await roleTable.update(id, {
					status: !data,
					updatedAt: currentTime(),
				});
				result.code = HTTP_CODE.NO_CONTENT;
			} else if (isString(data)) {
				await roleTable.update(id, {
					deletedAt: data !== "" ? data : undefined,
				});
				result.code = HTTP_CODE.NO_CONTENT;
				result.message = data !== "" ? RESPONSE_MESSAGE.DELETE : RESPONSE_MESSAGE.RESTORE;
			} else {
				if ((await fieldExist(TABLE_COLUMN.KEY.NAME, data.name)) && existing.name !== data.name) {
					result.code = HTTP_CODE.BAD_REQUEST;
					result.message = COLUMN_ROLE.EXIST.NAME;
				} else {
					await roleTable.update(id, data);

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
 * 批量删除/清空角色
 *
 * @param ids 角色 ID 数组
 * @param clear 是否清空角色
 *
 * @returns 删除结果响应
 */
async function deleteRole(ids: number[], clear: boolean = false): Promise<ResponseApi> {
	const result = responseData();

	try {
		await roleTable.bulkDelete(ids);

		result.code = HTTP_CODE.NO_CONTENT;
		result.message = clear ? RESPONSE_MESSAGE.CLEAR : RESPONSE_MESSAGE.BATCH_DESTROY;
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
	}

	return result;
}

/**
 * 角色元信息
 *
 * @returns 描述列表项数组
 */
function buildDescription(role?: Role): DescriptionSchema[] {
	if (role === undefined) return [];

	return [
		{
			label: TABLE_COLUMN.LABEL.NAME,
			value: role.name,
		},
		{
			label: TABLE_COLUMN.LABEL.STATUS,
			value: role.status ? STATUS_TEXT.ENABLED : STATUS_TEXT.DISABLED,
		},
		{
			label: TABLE_COLUMN.LABEL.CREATED_AT,
			value: role.createdAt ?? "",
			span: 2,
		},
		{
			label: TABLE_COLUMN.LABEL.UPDATED_AT,
			value: role.updatedAt ?? "",
			span: 2,
		},
	];
}

export { COLUMN_ROLE, INITIAL_ROLE, assignedRole, createRole, updateRole, deleteRole, buildDescription };
