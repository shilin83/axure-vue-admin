const COLUMN_MENU = {
	KEY: {
		PARENT_ID: "parentId",
		ICON: "icon",
	},
	LABEL: {
		PARENT_ID: "父菜单",
		ICON: "菜单图标",
	},
	EXIST: {
		CODE: "菜单标识已存在",
		NAME: "菜单名称已存在",
	},
};

const INITIAL_MENU: Menu = {
	id: 0,
	parentId: 0,
	code: "" as RouteKey,
	name: "",
	icon: "",
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
	return (await menuTable.where(field).equals(value).count()) > 0;
}

/**
 * 获取已分配的菜单 ID 列表
 *
 * @returns 已分配菜单 ID 数组
 */
async function assignedMenu(): Promise<number[]> {
	return (await roleTable.orderBy("menus").uniqueKeys()) as number[];
}

/**
 * 新增菜单
 *
 * @param data 菜单数据
 *
 * @returns 新增结果响应
 */
async function createMenu(data: Omit<Menu, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		if (await fieldExist(TABLE_COLUMN.KEY.CODE, data.code)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_MENU.EXIST.CODE;
		} else if (await fieldExist(TABLE_COLUMN.KEY.NAME, data.name)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_MENU.EXIST.NAME;
		} else {
			await menuTable.add(data);

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
 * 更新菜单
 *
 * @param id 菜单 ID
 * @param data 菜单数据
 *
 * @returns 更新结果响应
 */
async function updateMenu(id: number, data: Omit<Menu, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		const existing = await menuTable.get(id);
		if (existing !== undefined) {
			if ((await fieldExist(TABLE_COLUMN.KEY.CODE, data.code)) && existing.code !== data.code) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = COLUMN_MENU.EXIST.CODE;
			} else if ((await fieldExist(TABLE_COLUMN.KEY.NAME, data.name)) && existing.name !== data.name) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = COLUMN_MENU.EXIST.NAME;
			} else {
				await menuTable.update(id, data);

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
 * 删除菜单
 *
 * @param id 菜单 ID
 *
 * @returns 删除结果响应
 */
async function deleteMenu(id: number): Promise<ResponseApi> {
	const result = responseData();

	try {
		await menuTable.delete(id);

		result.code = HTTP_CODE.NO_CONTENT;
		result.message = RESPONSE_MESSAGE.DELETE;
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
	}

	return result;
}

export { COLUMN_MENU, INITIAL_MENU, assignedMenu, createMenu, deleteMenu, updateMenu };
