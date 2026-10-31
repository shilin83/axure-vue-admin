import type { PupilPosition, PupilProps } from "../types";

import { useEventListener, useMouse } from "@vueuse/core";
import { flatMap, intersectionWith, uniq } from "es-toolkit/array";

const { x, y } = useMouse();
const hasMouseMoved = ref<boolean>(false);

useEventListener(window, "mousemove", () => (hasMouseMoved.value = true), {
	once: true,
});

/**
 * 计算瞳孔位置：根据强制看向方向或鼠标位置计算瞳孔偏移坐标
 *
 * @param pupilRef 瞳孔元素引用
 * @param props 瞳孔属性
 *
 * @returns 瞳孔位置坐标
 */
function getPupilPosition(pupilRef: Ref<Nullable<HTMLDivElement>>, props: PupilProps): PupilPosition {
	const position: PupilPosition = {
		mouseX: 0,
		mouseY: 0,
	};

	if (pupilRef.value === null) return position;
	if (!hasMouseMoved.value) return position;

	if (props.forceLookX !== undefined && props.forceLookY !== undefined) {
		position.mouseX = props.forceLookX;
		position.mouseY = props.forceLookY;

		return position;
	}

	const pupil = pupilRef.value.getBoundingClientRect();
	const pupilCenterX = pupil.left + pupil.width / 2;
	const pupilCenterY = pupil.top + pupil.height / 2;
	const deltaX = x.value - pupilCenterX;
	const deltaY = y.value - pupilCenterY;
	const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), props.maxDistance ?? 0);
	const angle = Math.atan2(deltaY, deltaX);

	position.mouseX = Math.cos(angle) * distance;
	position.mouseY = Math.sin(angle) * distance;

	return position;
}

/**
 * 用户登录
 *
 * @param username 用户名
 * @param password 密码
 * @param remember 是否记住登录状态
 *
 * @returns 登录结果响应，包含用户、角色、菜单及权限信息
 */
async function handleLogin(username: string, password: string, remember: boolean): Promise<ResponseApi<Auth>> {
	const result = responseData<Auth>();

	try {
		const user = await userTable.get({
			username,
			password,
		});

		if (user === undefined) {
			result.code = HTTP_CODE.UNAUTHORIZED;
			result.message = "用户名或密码错误！";
		} else {
			const roles = await roleTable.where(TABLE_COLUMN.KEY.ID).anyOf(user.roles).toArray();
			const menus = await menuTable.toArray();
			const permissions = await permissionTable.toArray();

			result.message = "登录成功！页面自动跳转...";
			result.data = {
				remember,
				id: user.id,
				name: user.realname,
				avatar: user.avatar,
				roles: user.roles,
				menus: intersectionWith(menus, uniq(flatMap(roles, (role) => role.menus)), (obj, id) => obj.id === id).map(
					(item) => item.code,
				),
				permissions: intersectionWith(
					permissions,
					uniq(flatMap(roles, (role) => role.permissions)),
					(obj, id) => obj.id === id,
				).map((item) => item.code),
			};
		}
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER;
	}

	return result;
}

export { x, y, hasMouseMoved, getPupilPosition, handleLogin };
