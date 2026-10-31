/**
 * 初始化用户数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initUser(createdAt: string): Promise<void> {
	const userList: Omit<User, PrimaryKey>[] = [
		{
			createdAt,
			realname: "超管",
			username: ADMIN_USERNAME,
			password: DEFAULT_PASSWORD,
			email: `${ADMIN_USERNAME}${EMAIL_SUFFIX}`,
			phone: "13900000001",
			avatar: "circle-flags:cn",
			department: 1,
			roles: [1],
		},
		{
			createdAt,
			realname: "采购",
			username: "purchase",
			password: DEFAULT_PASSWORD,
			email: `purchase${EMAIL_SUFFIX}`,
			phone: "13900000002",
			avatar: "circle-flags:hk",
			department: 2,
			roles: [2],
		},
	];

	await userTable.bulkAdd(userList);
}

export { initUser };
