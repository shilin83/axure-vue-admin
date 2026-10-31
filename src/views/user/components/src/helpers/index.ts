import { isString } from "es-toolkit/predicate";

const COLUMN_USER = {
	KEY: {
		REALNAME: "realname",
		USERNAME: "username",
		EMAIL: "email",
		PHONE: "phone",
		DEPARTMENT: "department",
		ROLE: "roles",
		AVATAR: "avatar",
	},
	LABEL: {
		REALNAME: "姓名",
		USERNAME: "账号",
		EMAIL: "邮箱",
		PHONE: "手机号",
		DEPARTMENT: "所属部门",
		ROLE: "拥有角色",
		AVATAR: "头像",
	},
	EXIST: {
		USERNAME: "账号已存在",
		EMAIL: "邮箱已存在",
		PHONE: "手机号已存在",
	},
} as const;

const INITIAL_USER: User = {
	id: 0,
	realname: "",
	username: "",
	phone: "",
	email: "",
	avatar: "",
	department: 0,
	roles: [],
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
	field: typeof COLUMN_USER.KEY.USERNAME | typeof COLUMN_USER.KEY.EMAIL | typeof COLUMN_USER.KEY.PHONE,
	value: string,
): Promise<boolean> {
	return (await userTable.where(field).equals(value).count()) > 0;
}

/**
 * 新增用户
 *
 * @param data 用户数据
 *
 * @returns 新增结果响应
 */
async function createUser(data: Omit<User, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		if (await fieldExist(COLUMN_USER.KEY.USERNAME, data.username)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_USER.EXIST.USERNAME;
		} else if (await fieldExist(COLUMN_USER.KEY.EMAIL, data.email)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_USER.EXIST.EMAIL;
		} else if (await fieldExist(COLUMN_USER.KEY.PHONE, data.phone)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_USER.EXIST.PHONE;
		} else {
			await userTable.add(data);

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
 * 更新用户
 *
 * @param id 用户 ID
 * @param data 用户数据
 *
 * @returns 更新结果响应
 */
async function updateUser(id: number, data: string | Omit<User, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		const existing = await userTable.get(id);
		if (existing !== undefined) {
			if (isString(data)) {
				await userTable.update(id, {
					deletedAt: data !== "" ? data : undefined,
				});
				result.code = HTTP_CODE.NO_CONTENT;
				result.message = data !== "" ? RESPONSE_MESSAGE.DELETE : RESPONSE_MESSAGE.RESTORE;
			} else {
				if ((await fieldExist(COLUMN_USER.KEY.USERNAME, data.username)) && existing.username !== data.username) {
					result.code = HTTP_CODE.BAD_REQUEST;
					result.message = COLUMN_USER.EXIST.USERNAME;
				} else if ((await fieldExist(COLUMN_USER.KEY.EMAIL, data.email)) && existing.email !== data.email) {
					result.code = HTTP_CODE.BAD_REQUEST;
					result.message = COLUMN_USER.EXIST.EMAIL;
				} else if ((await fieldExist(COLUMN_USER.KEY.PHONE, data.phone)) && existing.phone !== data.phone) {
					result.code = HTTP_CODE.BAD_REQUEST;
					result.message = COLUMN_USER.EXIST.PHONE;
				} else {
					await userTable.update(id, data);

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
 * 批量删除/清空用户
 *
 * @param ids 用户 ID 数组
 * @param clear 是否清空用户
 *
 * @returns 删除结果响应
 */
async function deleteUser(ids: number[], clear: boolean = false): Promise<ResponseApi> {
	const result = responseData();

	try {
		await userTable.bulkDelete(ids);

		result.code = HTTP_CODE.NO_CONTENT;
		result.message = clear ? RESPONSE_MESSAGE.CLEAR : RESPONSE_MESSAGE.BATCH_DESTROY;
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
	}

	return result;
}

/**
 * 用户元信息
 *
 * @returns 描述列表项数组
 */
function buildDescription(user?: User): DescriptionSchema[] {
	if (user === undefined) return [];

	return [
		{
			label: COLUMN_USER.LABEL.REALNAME,
			value: user.realname,
		},
		{
			label: COLUMN_USER.LABEL.USERNAME,
			value: user.username,
		},
		{
			label: COLUMN_USER.LABEL.EMAIL,
			value: user.email,
		},
		{
			label: COLUMN_USER.LABEL.PHONE,
			value: user.phone,
		},
		{
			label: TABLE_COLUMN.LABEL.CREATED_AT,
			value: user.createdAt ?? "",
			span: 2,
		},
		{
			label: TABLE_COLUMN.LABEL.UPDATED_AT,
			value: user.updatedAt ?? "",
			span: 2,
		},
	];
}

export { COLUMN_USER, INITIAL_USER, createUser, updateUser, deleteUser, buildDescription };
