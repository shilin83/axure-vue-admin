type PermissionCode = (typeof PERMISSION_CODE)[keyof typeof PERMISSION_CODE];

interface Permission extends BaseModel {
	parentId: number;
	name: string;
	code: PermissionCode;
	children?: Permission[];
}

const USER = "用户";
const ROLE = "角色";
const MENU = "菜单";
const PERMISSION = "权限";
const DEPARTMENT = "部门";

/** 权限码集合 */
const PERMISSION_CODE = {
	USER: "user",
	USER_ADD: "user:add",
	USER_EDIT: "user:edit",
	USER_DELETE: "user:delete",
	ROLE: "role",
	ROLE_ADD: "role:add",
	ROLE_EDIT: "role:edit",
	ROLE_DELETE: "role:delete",
	MENU: "menu",
	MENU_ADD: "menu:add",
	MENU_EDIT: "menu:edit",
	MENU_DELETE: "menu:delete",
	PERMISSION: "permission",
	PERMISSION_ADD: "permission:add",
	PERMISSION_EDIT: "permission:edit",
	PERMISSION_DELETE: "permission:delete",
	DEPARTMENT: "department",
	DEPARTMENT_ADD: "department:add",
	DEPARTMENT_EDIT: "department:edit",
	DEPARTMENT_DELETE: "department:delete",
} as const;

/**
 * 初始权限数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initPermission(createdAt: string): Promise<void> {
	await permissionTable.bulkAdd([
		{
			createdAt,
			parentId: 0,
			code: PERMISSION_CODE.USER,
			name: MENU_PATH[PERMISSION_CODE.USER],
		},
		{
			createdAt,
			parentId: 1,
			code: PERMISSION_CODE.USER_ADD,
			name: BUTTON_MAP.ADD.LABEL + USER,
		},
		{
			createdAt,
			parentId: 1,
			code: PERMISSION_CODE.USER_EDIT,
			name: BUTTON_MAP.EDIT.LABEL + USER,
		},
		{
			createdAt,
			parentId: 1,
			code: PERMISSION_CODE.USER_DELETE,
			name: BUTTON_MAP.DELETE.LABEL + USER,
		},
		{
			createdAt,
			parentId: 0,
			code: PERMISSION_CODE.ROLE,
			name: MENU_PATH[PERMISSION_CODE.ROLE],
		},
		{
			createdAt,
			parentId: 5,
			code: PERMISSION_CODE.ROLE_ADD,
			name: BUTTON_MAP.ADD.LABEL + ROLE,
		},
		{
			createdAt,
			parentId: 5,
			code: PERMISSION_CODE.ROLE_EDIT,
			name: BUTTON_MAP.EDIT.LABEL + ROLE,
		},
		{
			createdAt,
			parentId: 5,
			code: PERMISSION_CODE.ROLE_DELETE,
			name: BUTTON_MAP.DELETE.LABEL + ROLE,
		},
		{
			createdAt,
			parentId: 0,
			code: PERMISSION_CODE.MENU,
			name: MENU_PATH[PERMISSION_CODE.MENU],
		},
		{
			createdAt,
			parentId: 9,
			code: PERMISSION_CODE.MENU_ADD,
			name: BUTTON_MAP.ADD.LABEL + MENU,
		},
		{
			createdAt,
			parentId: 9,
			code: PERMISSION_CODE.MENU_EDIT,
			name: BUTTON_MAP.EDIT.LABEL + MENU,
		},
		{
			createdAt,
			parentId: 9,
			code: PERMISSION_CODE.MENU_DELETE,
			name: BUTTON_MAP.DELETE.LABEL + MENU,
		},
		{
			createdAt,
			parentId: 0,
			code: PERMISSION_CODE.PERMISSION,
			name: MENU_PATH[PERMISSION_CODE.PERMISSION],
		},
		{
			createdAt,
			parentId: 13,
			code: PERMISSION_CODE.PERMISSION_ADD,
			name: BUTTON_MAP.ADD.LABEL + PERMISSION,
		},
		{
			createdAt,
			parentId: 13,
			code: PERMISSION_CODE.PERMISSION_EDIT,
			name: BUTTON_MAP.EDIT.LABEL + PERMISSION,
		},
		{
			createdAt,
			parentId: 13,
			code: PERMISSION_CODE.PERMISSION_DELETE,
			name: BUTTON_MAP.DELETE.LABEL + PERMISSION,
		},
		{
			createdAt,
			parentId: 0,
			code: PERMISSION_CODE.DEPARTMENT,
			name: MENU_PATH[PERMISSION_CODE.DEPARTMENT],
		},
		{
			createdAt,
			parentId: 17,
			code: PERMISSION_CODE.DEPARTMENT_ADD,
			name: BUTTON_MAP.ADD.LABEL + DEPARTMENT,
		},
		{
			createdAt,
			parentId: 17,
			code: PERMISSION_CODE.DEPARTMENT_EDIT,
			name: BUTTON_MAP.EDIT.LABEL + DEPARTMENT,
		},
		{
			createdAt,
			parentId: 17,
			code: PERMISSION_CODE.DEPARTMENT_DELETE,
			name: BUTTON_MAP.DELETE.LABEL + DEPARTMENT,
		},
	]);
}

export type { Permission, PermissionCode };
export { PERMISSION_CODE, initPermission };
