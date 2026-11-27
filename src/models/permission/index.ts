interface Permission extends BaseModel {
	parentId: number;
	code: PermissionCode;
	name: string;
	children?: Permission[];
}

type PermissionCode = (typeof PERMISSION_CODE)[keyof typeof PERMISSION_CODE];

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
async function initPermission(createdAt: number): Promise<void> {
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
			name: "新增用户",
		},
		{
			createdAt,
			parentId: 1,
			code: PERMISSION_CODE.USER_EDIT,
			name: "编辑用户",
		},
		{
			createdAt,
			parentId: 1,
			code: PERMISSION_CODE.USER_DELETE,
			name: "删除用户",
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
			name: "新增角色",
		},
		{
			createdAt,
			parentId: 5,
			code: PERMISSION_CODE.ROLE_EDIT,
			name: "编辑角色",
		},
		{
			createdAt,
			parentId: 5,
			code: PERMISSION_CODE.ROLE_DELETE,
			name: "删除角色",
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
			name: "新增菜单",
		},
		{
			createdAt,
			parentId: 9,
			code: PERMISSION_CODE.MENU_EDIT,
			name: "编辑菜单",
		},
		{
			createdAt,
			parentId: 9,
			code: PERMISSION_CODE.MENU_DELETE,
			name: "删除菜单",
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
			name: "新增权限",
		},
		{
			createdAt,
			parentId: 13,
			code: PERMISSION_CODE.PERMISSION_EDIT,
			name: "编辑权限",
		},
		{
			createdAt,
			parentId: 13,
			code: PERMISSION_CODE.PERMISSION_DELETE,
			name: "删除权限",
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
			name: "新增部门",
		},
		{
			createdAt,
			parentId: 17,
			code: PERMISSION_CODE.DEPARTMENT_EDIT,
			name: "编辑部门",
		},
		{
			createdAt,
			parentId: 17,
			code: PERMISSION_CODE.DEPARTMENT_DELETE,
			name: "删除部门",
		},
	]);
}

export type { Permission, PermissionCode };
export { initPermission, PERMISSION_CODE };
