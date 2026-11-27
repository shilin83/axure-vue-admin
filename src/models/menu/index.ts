interface Menu extends BaseModel {
	parentId: number;
	code: MenuKey;
	name: string;
	icon: string;
	children?: Menu[];
}

type MenuKey = (typeof MENU_KEY)[keyof typeof MENU_KEY];

const MENU_KEY = {
	LOGIN: "login",
	HOME: "home",
	SYSTEM: "system",
	USER: "user",
	ROLE: "role",
	MENU: "menu",
	PERMISSION: "permission",
	DEPARTMENT: "department",
} as const;

const MENU_PATH = {
	[MENU_KEY.LOGIN]: "登录",
	[MENU_KEY.HOME]: "首页",
	[MENU_KEY.SYSTEM]: "系统管理",
	[MENU_KEY.USER]: "用户管理",
	[MENU_KEY.ROLE]: "角色管理",
	[MENU_KEY.MENU]: "菜单管理",
	[MENU_KEY.PERMISSION]: "权限管理",
	[MENU_KEY.DEPARTMENT]: "部门管理",
} as const satisfies Recordable<string, MenuKey>;

/**
 * 初始菜单数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initMenu(createdAt: number): Promise<void> {
	await menuTable.bulkAdd([
		{
			createdAt,
			parentId: 0,
			code: MENU_KEY.HOME,
			name: MENU_PATH[MENU_KEY.HOME],
			icon: "flagpack:fr",
		},
		{
			createdAt,
			parentId: 0,
			code: MENU_KEY.SYSTEM,
			name: MENU_PATH[MENU_KEY.SYSTEM],
			icon: "flagpack:ar",
		},
		{
			createdAt,
			parentId: 2,
			code: MENU_KEY.USER,
			name: MENU_PATH[MENU_KEY.USER],
			icon: "flagpack:de",
		},
		{
			createdAt,
			parentId: 2,
			code: MENU_KEY.DEPARTMENT,
			name: MENU_PATH[MENU_KEY.DEPARTMENT],
			icon: "flagpack:br",
		},
		{
			createdAt,
			parentId: 2,
			code: MENU_KEY.ROLE,
			name: MENU_PATH[MENU_KEY.ROLE],
			icon: "flagpack:es",
		},
		{
			createdAt,
			parentId: 2,
			code: MENU_KEY.PERMISSION,
			name: MENU_PATH[MENU_KEY.PERMISSION],
			icon: "flagpack:it",
		},
		{
			createdAt,
			parentId: 2,
			code: MENU_KEY.MENU,
			name: MENU_PATH[MENU_KEY.MENU],
			icon: "flagpack:nl",
		},
	]);
}

export type { Menu, MenuKey };
export { initMenu, MENU_KEY, MENU_PATH };
