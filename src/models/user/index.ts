interface User extends BaseModel {
	password?: string;
	account: string;
	name: string;
	phone: string;
	email: string;
	avatar: string;
	department: number;
	roles: number[];
}

const DEFAULT_USER = {
	ACCOUNT: "admin",
	PASSWORD: "123456",
	EMAIL_SUFFIX: "@axure.com",
} as const;

/**
 * 初始用户数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initUser(createdAt: number): Promise<void> {
	await userTable.add({
		createdAt,
		name: "超管",
		account: DEFAULT_USER.ACCOUNT,
		password: DEFAULT_USER.PASSWORD,
		email: `${DEFAULT_USER.ACCOUNT}${DEFAULT_USER.EMAIL_SUFFIX}`,
		phone: "13900000001",
		avatar: "circle-flags:cn",
		department: 1,
		roles: [1],
	});
}

export type { User };
export { initUser, DEFAULT_USER };
