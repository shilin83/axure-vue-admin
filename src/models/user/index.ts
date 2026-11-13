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

const ADMIN_USERNAME = "admin";
const DEFAULT_PASSWORD = "123456";
const EMAIL_SUFFIX = "@axure.com";

/**
 * 初始用户数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initUser(createdAt: string): Promise<void> {
	await userTable.bulkAdd([
		{
			createdAt,
			name: "超管",
			account: ADMIN_USERNAME,
			password: DEFAULT_PASSWORD,
			email: `${ADMIN_USERNAME}${EMAIL_SUFFIX}`,
			phone: "13900000001",
			avatar: "circle-flags:cn",
			department: 1,
			roles: [1],
		},
		{
			createdAt,
			name: "运营",
			account: "operator",
			password: DEFAULT_PASSWORD,
			email: `operator${EMAIL_SUFFIX}`,
			phone: "13900000002",
			avatar: "circle-flags:hk",
			department: 2,
			roles: [2],
		},
		{
			createdAt,
			name: "采购",
			account: "purchase",
			password: DEFAULT_PASSWORD,
			email: `purchase${EMAIL_SUFFIX}`,
			phone: "13900000003",
			avatar: "circle-flags:mo",
			department: 3,
			roles: [3],
		},
	]);
}

export type { User };
export { ADMIN_USERNAME, DEFAULT_PASSWORD, EMAIL_SUFFIX, initUser };
