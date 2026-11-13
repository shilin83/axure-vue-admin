import { StorageSerializers, useLocalStorage } from "@vueuse/core";

const authState = useLocalStorage<Auth>("auth", null, {
	serializer: StorageSerializers.object,
});

/**
 * 获取当前登录用户的认证信息
 *
 * @returns 当前认证信息（Auth 对象），未登录时为 NULL_VALUE
 */
function getAuth(): Auth {
	return authState.value;
}

/**
 * 设置当前登录用户的认证信息
 *
 * @param data 认证信息，允许为 null；为 null 时写入 NULL_VALUE
 *
 * @returns 无内容
 */
function setAuth(data: Nullable<Auth>): void {
	authState.value = data ?? null;
}

/**
 * 清除当前登录用户的认证信息
 *
 * @returns 无内容
 */
function removeAuth(): void {
	authState.value = null;
}

export { getAuth, setAuth, removeAuth };
