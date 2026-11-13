type MenuKey = (typeof MENU_KEY)[keyof typeof MENU_KEY];

interface Menu extends BaseModel {
	parentId: number;
	code: MenuKey;
	name: string;
	icon: string;
	children?: Menu[];
}

/** 菜单键值 */
const MENU_KEY = {
	LOGIN: "login",
	HOME: "home",
	SYSTEM: "system",
	USER: "user",
	ROLE: "role",
	MENU: "menu",
	DEPARTMENT: "department",
	PERMISSION: "permission",
	SUPPLIER: "supplier",
	SUPPLIER_PROFILE: "supplierProfile",
} as const;

/** 菜单路径映射 */
const MENU_PATH = {
	[MENU_KEY.LOGIN]: "登录",
	[MENU_KEY.HOME]: "首页",
	[MENU_KEY.SYSTEM]: "系统管理",
	[MENU_KEY.USER]: "用户管理",
	[MENU_KEY.ROLE]: "角色管理",
	[MENU_KEY.MENU]: "菜单管理",
	[MENU_KEY.DEPARTMENT]: "部门管理",
	[MENU_KEY.PERMISSION]: "权限管理",
	[MENU_KEY.SUPPLIER]: "供应商管理",
	[MENU_KEY.SUPPLIER_PROFILE]: "供应商档案",
} as const satisfies Recordable<string, MenuKey>;

/**
 * 初始菜单数据
 *
 * @param createdAt 创建时间
 *
 * @returns 无内容
 */
async function initMenu(createdAt: string): Promise<void> {
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
		{
			createdAt,
			parentId: 0,
			code: MENU_KEY.SUPPLIER,
			name: MENU_PATH[MENU_KEY.SUPPLIER],
			icon: "flagpack:gb",
		},
		{
			createdAt,
			parentId: 8,
			code: MENU_KEY.SUPPLIER_PROFILE,
			name: MENU_PATH[MENU_KEY.SUPPLIER_PROFILE],
			icon: "flagpack:gb-nir",
		},
	]);
}

export type { Menu, MenuKey };
export { MENU_KEY, MENU_PATH, initMenu };
