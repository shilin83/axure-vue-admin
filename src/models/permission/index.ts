const USER = "用户";
const ROLE = "角色";
const MENU = "菜单";
const DEPARTMENT = "部门";
const PERMISSION = "权限";

/**
 * 初始化权限数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initPermission(createdAt: string): Promise<void> {
	const permissionList: Omit<Permission, PrimaryKey>[] = [
		{
			createdAt,
			parentId: 0,
			code: ROUTE_KEY.USER,
			name: ROUTE_PATH[ROUTE_KEY.USER],
		},
		{
			createdAt,
			parentId: 1,
			code: `${PERMISSION_CODE.USER_ADD}`,
			name: `${BUTTON_MAP.ADD.LABEL}${USER}`,
		},
		{
			createdAt,
			parentId: 1,
			code: `${PERMISSION_CODE.USER_EDIT}`,
			name: `${BUTTON_MAP.EDIT.LABEL}${USER}`,
		},
		{
			createdAt,
			parentId: 1,
			code: `${PERMISSION_CODE.USER_DELETE}`,
			name: `${BUTTON_MAP.DELETE.LABEL}${USER}`,
		},
		{
			createdAt,
			parentId: 0,
			code: ROUTE_KEY.ROLE,
			name: ROUTE_PATH[ROUTE_KEY.ROLE],
		},
		{
			createdAt,
			parentId: 5,
			code: `${PERMISSION_CODE.ROLE_ADD}`,
			name: `${BUTTON_MAP.ADD.LABEL}${ROLE}`,
		},
		{
			createdAt,
			parentId: 5,
			code: `${PERMISSION_CODE.ROLE_EDIT}`,
			name: `${BUTTON_MAP.EDIT.LABEL}${ROLE}`,
		},
		{
			createdAt,
			parentId: 5,
			code: `${PERMISSION_CODE.ROLE_DELETE}`,
			name: `${BUTTON_MAP.DELETE.LABEL}${ROLE}`,
		},
		{
			createdAt,
			parentId: 0,
			code: ROUTE_KEY.MENU,
			name: ROUTE_PATH[ROUTE_KEY.MENU],
		},
		{
			createdAt,
			parentId: 9,
			code: `${PERMISSION_CODE.MENU_ADD}`,
			name: `${BUTTON_MAP.ADD.LABEL}${MENU}`,
		},
		{
			createdAt,
			parentId: 9,
			code: `${PERMISSION_CODE.MENU_EDIT}`,
			name: `${BUTTON_MAP.EDIT.LABEL}${MENU}`,
		},
		{
			createdAt,
			parentId: 9,
			code: `${PERMISSION_CODE.MENU_DELETE}`,
			name: `${BUTTON_MAP.DELETE.LABEL}${MENU}`,
		},
		{
			createdAt,
			parentId: 0,
			code: ROUTE_KEY.PERMISSION,
			name: ROUTE_PATH[ROUTE_KEY.PERMISSION],
		},
		{
			createdAt,
			parentId: 13,
			code: `${PERMISSION_CODE.PERMISSION_ADD}`,
			name: `${BUTTON_MAP.ADD.LABEL}${PERMISSION}`,
		},
		{
			createdAt,
			parentId: 13,
			code: `${PERMISSION_CODE.PERMISSION_EDIT}`,
			name: `${BUTTON_MAP.EDIT.LABEL}${PERMISSION}`,
		},
		{
			createdAt,
			parentId: 13,
			code: `${PERMISSION_CODE.PERMISSION_DELETE}`,
			name: `${BUTTON_MAP.DELETE.LABEL}${PERMISSION}`,
		},
		{
			createdAt,
			parentId: 0,
			code: ROUTE_KEY.DEPARTMENT,
			name: ROUTE_PATH[ROUTE_KEY.DEPARTMENT],
		},
		{
			createdAt,
			parentId: 17,
			code: `${PERMISSION_CODE.DEPARTMENT_ADD}`,
			name: `${BUTTON_MAP.ADD.LABEL}${DEPARTMENT}`,
		},
		{
			createdAt,
			parentId: 17,
			code: `${PERMISSION_CODE.DEPARTMENT_EDIT}`,
			name: `${BUTTON_MAP.EDIT.LABEL}${DEPARTMENT}`,
		},
		{
			createdAt,
			parentId: 17,
			code: `${PERMISSION_CODE.DEPARTMENT_DELETE}`,
			name: `${BUTTON_MAP.DELETE.LABEL}${DEPARTMENT}`,
		},
	];

	await permissionTable.bulkAdd(permissionList);
}

export { initPermission };
