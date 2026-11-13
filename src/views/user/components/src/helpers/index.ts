import { isNumber } from "es-toolkit/predicate";

const INITIAL_USER: User = {
	id: 0,
	department: 0,
	name: "",
	account: "",
	phone: "",
	email: "",
	avatar: "",
	roles: [],
	createdAt: "",
	updatedAt: "",
};

const COLUMN_USER = {
	KEY: {
		NAME: "name",
		ACCOUNT: "account",
		EMAIL: "email",
		PHONE: "phone",
		AVATAR: "avatar",
		ROLES: "roles",
		DEPARTMENT: "department",
	},
	LABEL: {
		NAME: "姓名",
		ACCOUNT: "账号",
		EMAIL: "邮箱",
		PHONE: "手机号",
		AVATAR: "头像",
		ROLES: "角色",
		DEPARTMENT: "部门",
	},
	EXIST: {
		ACCOUNT: "账号已存在",
		EMAIL: "邮箱已存在",
		PHONE: "手机号已存在",
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
async function fieldExist(
	field: (typeof COLUMN_USER.KEY)["ACCOUNT" | "EMAIL" | "PHONE"],
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
		if (await fieldExist(COLUMN_USER.KEY.ACCOUNT, data.account)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_USER.EXIST.ACCOUNT;
		} else if (await fieldExist(COLUMN_USER.KEY.EMAIL, data.email)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_USER.EXIST.EMAIL;
		} else if (await fieldExist(COLUMN_USER.KEY.PHONE, data.phone)) {
			result.code = HTTP_CODE.BAD_REQUEST;
			result.message = COLUMN_USER.EXIST.PHONE;
		} else {
			await userTable.add(data);

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
 * 更新用户
 *
 * @param id 用户 ID
 * @param data 用户数据
 *
 * @returns 更新结果响应
 */
async function updateUser(id: number, data: Omit<User, PrimaryKey>): Promise<ResponseApi> {
	const result = responseData();

	try {
		const existing = await userTable.get(id);
		if (existing === undefined) {
			result.code = HTTP_CODE.NOT_FOUND;
			result.message = RESPONSE_MESSAGE.NOT_FOUND;
		} else {
			if ((await fieldExist(COLUMN_USER.KEY.ACCOUNT, data.account)) && existing.account !== data.account) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = COLUMN_USER.EXIST.ACCOUNT;
			} else if ((await fieldExist(COLUMN_USER.KEY.EMAIL, data.email)) && existing.email !== data.email) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = COLUMN_USER.EXIST.EMAIL;
			} else if ((await fieldExist(COLUMN_USER.KEY.PHONE, data.phone)) && existing.phone !== data.phone) {
				result.code = HTTP_CODE.BAD_REQUEST;
				result.message = COLUMN_USER.EXIST.PHONE;
			} else {
				await userTable.update(id, data);

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
 * 删除用户
 *
 * @param id 用户 ID
 *
 * @returns 删除结果响应
 */
async function deleteUser(id: Arrayable<number>): Promise<ResponseApi> {
	const result = responseData();

	try {
		if (isNumber(id)) {
			await userTable.delete(id);
		} else {
			await userTable.bulkDelete(id);
		}

		result.code = HTTP_CODE.NO_CONTENT;
		result.message = isNumber(id) ? RESPONSE_MESSAGE.DELETED : RESPONSE_MESSAGE.BATCH_DESTROY;
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER_ERROR;
	}

	return result;
}

export { INITIAL_USER, COLUMN_USER, createUser, updateUser, deleteUser };
