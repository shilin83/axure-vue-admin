import Dexie, { type EntityTable } from "dexie";

interface BaseModel {
	id: number;
	status?: boolean;
	createdAt?: number;
	updatedAt?: number;
}

const db = new Dexie("axure") as Dexie & {
	menus: EntityTable<Omit<Menu, "children">, PrimaryKey>;
	permissions: EntityTable<Omit<Permission, "children">, PrimaryKey>;
	departments: EntityTable<Department, PrimaryKey>;
	roles: EntityTable<Role, PrimaryKey>;
	users: EntityTable<User, PrimaryKey>;
};

db.version(1).stores({
	menus: "++id, &code, &name, parentId",
	permissions: "++id, &code, &name, parentId",
	departments: "++id, &name",
	roles: "++id, &name, *permissions, *menus",
	users: "++id, &account, &email, &phone, department, *roles, [account+password]",
});

const menuTable = db.menus;
const permissionTable = db.permissions;
const departmentTable = db.departments;
const roleTable = db.roles;
const userTable = db.users;

/**
 * 初始化数据库
 *
 * @returns 无内容
 */
async function initDexie(): Promise<void> {
	try {
		const createdAt = currentUnix();

		if ((await menuTable.count()) === 0) {
			await db.transaction("rw", [menuTable, permissionTable, departmentTable, roleTable, userTable], async () => {
				await initMenu(createdAt);
				await initPermission(createdAt);
				await initDepartment(createdAt);
				await initRole(createdAt);
				await initUser(createdAt);
			});
		}
	} catch (e) {
		console.error(e);

		throw new Error("数据初始化失败！");
	}
}

/**
 * 删除数据库
 *
 * @returns 无内容
 */
async function deleteDexie(): Promise<void> {
	await db.delete();
}

export type { BaseModel };
export { initDexie, deleteDexie, menuTable, permissionTable, departmentTable, roleTable, userTable };
