import type { Directive, DirectiveBinding } from "vue";

const { warning } = useNotification();
const handlerMap = new WeakMap<HTMLElement, (e: Event) => void>();

/**
 * 校验当前用户是否拥有指定权限
 *
 * @param code 权限标识
 *
 * @returns 是否拥有权限：未登录返回 false，角色包含超级管理员返回 true，否则判断权限列表是否包含指定权限标识
 */
function hasPermission(code: PermissionCode): boolean {
	const auth = getAuth();

	if (auth === null) return false;
	if (auth.roles.includes(1)) return true;

	return auth.permissions.includes(code);
}

/**
 * 指令挂载时，为元素绑定权限校验的点击事件
 *
 * @param el 绑定了权限指令的元素
 * @param binding 指令绑定信息，value 为所需权限标识
 *
 * @returns 无内容
 */
function mounted(el: HTMLElement, binding: DirectiveBinding<PermissionCode>): void {
	const handler = (e: Event): void => {
		if (hasPermission(binding.value)) return;

		e.preventDefault();
		e.stopPropagation();

		warning("权限不足，无法执行该操作！");
	};

	handlerMap.set(el, handler);
	el.addEventListener("click", handler, true);
}

/**
 * 指令卸载时，移除元素上绑定的权限校验点击事件
 *
 * @param el 绑定了权限指令的元素
 *
 * @returns 无内容
 */
function unmounted(el: HTMLElement): void {
	const handler = handlerMap.get(el);
	if (handler !== undefined) el.removeEventListener("click", handler, true);
}

export const vPerm: Directive = {
	mounted,
	unmounted,
};
