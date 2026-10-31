/**
 * 弹出退出系统确认框，确认后执行退出登录
 *
 * @returns 无内容
 */
function confirmLogout(): void {
	useMessageBox()
		.confirm("您确定退出系统吗？")
		.then(() => handleLogout())
		.catch(() => {});
}

/**
 * 退出登录
 *
 * @returns 无内容
 */
function handleLogout(): void {
	removeAuth();
	redirectPage(ROUTE_KEY.LOGIN);
}

/**
 * 修改密码
 *
 * @param id 用户 ID
 * @param password 新密码
 *
 * @returns 修改结果响应
 */
async function changePassword(id: number, password: string): Promise<ResponseApi> {
	const result = responseData();

	try {
		await userTable.update(id, {
			password,
		});

		result.code = HTTP_CODE.NO_CONTENT;
		result.message = "密码已修改，请重新登录！";
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
	}

	return result;
}

export { confirmLogout, handleLogout, changePassword };
