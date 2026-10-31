import Dexie, { type EntityTable } from "dexie";

import { initDepartment } from "./department";
import { initMenu } from "./menu";
import { initPermission } from "./permission";
import { initRole } from "./role";
import { initUser } from "./user";
import { currentTime } from "@/utils";

const DB_NAME = "axure";

const db = new Dexie(DB_NAME) as Dexie & {
	users: EntityTable<User, PrimaryKey>;
	roles: EntityTable<Role, PrimaryKey>;
	menus: EntityTable<Omit<Menu, "children">, PrimaryKey>;
	permissions: EntityTable<Omit<Permission, "children">, PrimaryKey>;
	departments: EntityTable<Department, PrimaryKey>;
};

db.version(1).stores({
	users: "++id, &username, &email, &phone, department, *roles, [username+password]",
	roles: "++id, &name, *permissions, *menus",
	menus: "++id, &code, &name, parentId",
	permissions: "++id, &code, &name, parentId",
	departments: "++id, &name",
});

const userTable = db.users;
const roleTable = db.roles;
const menuTable = db.menus;
const permissionTable = db.permissions;
const departmentTable = db.departments;

/**
 * 重置数据库：删除整个 IndexedDB 数据库
 *
 * @returns 无内容
 */
async function resetDexie(): Promise<void> {
	await Dexie.delete(DB_NAME);
}

/**
 * 初始化数据库
 *
 * @returns 无内容
 */
async function initDexie(): Promise<void> {
	try {
		if (!(await Dexie.exists(DB_NAME))) {
			const createdAt = currentTime();

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

export { initDexie, resetDexie, userTable, roleTable, menuTable, permissionTable, departmentTable };
