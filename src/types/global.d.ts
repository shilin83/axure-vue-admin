type Nullable<T> = T | null;

type Optional<T> = T | undefined;

type Arrayable<T> = T | T[];

type Recordable<T = unknown, K extends PropertyKey = string> = Record<K, T>;

type PrimaryKey = "id";

interface BaseModel {
	id: number;
	name: string;
	code?: string;
	createdAt?: string;
	updatedAt?: string;
}

interface Auth {
	id: number;
	name: string;
	avatar: string;
	remember: boolean;
	roles: number[];
	menus: MenuKey[];
	permissions: PermissionCode[];
}
