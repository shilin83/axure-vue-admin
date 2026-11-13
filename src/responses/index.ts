interface ResponseApi<T = unknown> {
	code: (typeof HTTP_CODE)[keyof typeof HTTP_CODE];
	data: Nullable<T>;
	message: string;
}

/** HTTP 状态码 */
const HTTP_CODE = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	SERVER_ERROR: 500,
};

/** 响应提示信息 */
const RESPONSE_MESSAGE = {
	CREATED: "创建成功！",
	UPDATED: "更新成功！",
	DELETED: "删除成功！",
	NOT_FOUND: "资源不存在！",
	BATCH_DESTROY: "批量删除完成！",
	SERVER_ERROR: "服务器错误，请稍后重试！",
};

/**
 * 创建请求结果对象
 *
 * @param data 结果数据，缺省为空
 *
 * @returns 包含成功状态码、数据与提示信息的响应对象
 */
function responseData<T = unknown>(): ResponseApi<T> {
	return {
		code: HTTP_CODE.OK,
		data: null,
		message: "",
	};
}

export type { ResponseApi };
export { HTTP_CODE, RESPONSE_MESSAGE, responseData };
