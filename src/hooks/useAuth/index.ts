import { StorageSerializers, useLocalStorage } from "@vueuse/core";

interface Auth {
	id: number;
	name: string;
	avatar: string;
	remember: boolean;
	roles: number[];
	menus: MenuKey[];
	permissions: PermissionCode[];
}

const authState = useLocalStorage<Auth>("auth", null, {
	serializer: StorageSerializers.object,
});

/**
 * 获取当前登录用户的认证信息
 *
 * @returns 当前认证信息（Auth 对象）
 */
function getAuth(): Auth {
	return authState.value;
}

/**
 * 设置当前登录用户的认证信息
 *
 * @param data 认证信息
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

export type { Auth };
export { getAuth, setAuth, removeAuth };
