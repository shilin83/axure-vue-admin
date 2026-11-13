/**
 * 退出登录
 *
 * @returns 无内容
 */
function handleLogout(): void {
	removeAuth();
	redirectPage(MENU_KEY.LOGIN);
}

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
 * 修改密码
 *
 * @param id 用户 ID
 * @param password 新密码
 *
 * @returns 修改密码结果
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
		result.message = RESPONSE_MESSAGE.SERVER_ERROR;
	}

	return result;
}

export { confirmLogout, changePassword, handleLogout };
