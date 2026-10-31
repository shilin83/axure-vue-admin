declare global {
	type Recordable<T = unknown, K extends PropertyKey = string> = Record<K, T>;

	type Nullable<T> = T | null;

	type Optional<T> = T | undefined;

	type PrimaryKey = (typeof TABLE_COLUMN.KEY)["ID"];

	type RouteKey = (typeof ROUTE_KEY)[keyof typeof ROUTE_KEY];

	type PermissionCode = (typeof PERMISSION_CODE)[keyof typeof PERMISSION_CODE];

	interface ResponseApi<T = unknown> {
		code: (typeof HTTP_CODE)[keyof typeof HTTP_CODE];
		data: Nullable<T>;
		message: string;
	}

	interface Auth {
		id: number;
		name: string;
		avatar: string;
		remember: boolean;
		roles: number[];
		menus: RouteKey[];
		permissions: PermissionCode[];
	}

	interface BaseModel {
		id: number;
		createdAt?: string;
		updatedAt?: string;
		deletedAt?: string;
	}

	interface Department extends BaseModel {
		name: string;
		status: boolean;
	}

	interface Role extends BaseModel {
		name: string;
		menus: number[];
		permissions: number[];
		status: boolean;
	}

	interface Permission extends BaseModel {
		code: PermissionCode;
		name: string;
		parentId: number;
		children?: Permission[];
	}

	interface Menu extends BaseModel {
		code: RouteKey;
		name: string;
		icon: string;
		parentId: number;
		children?: Menu[];
	}

	interface User extends BaseModel {
		password?: string;
		realname: string;
		username: string;
		phone: string;
		email: string;
		avatar: string;
		department: number;
		roles: number[];
	}
}

export {};
