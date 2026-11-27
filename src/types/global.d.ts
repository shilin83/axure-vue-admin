type Nullable<T> = T | null;

type Optional<T> = T | undefined;

type Arrayable<T> = T | T[];

type Recordable<T = unknown, K extends PropertyKey = string> = Record<K, T>;

type PrimaryKey = "id";
