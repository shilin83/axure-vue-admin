interface UserProps {
	data: User[];
	recycled: User[];
	roles: Role[];
	departments: Department[];
}

type UserExpose = {
	open: (row?: User) => void;
};

export type { UserProps, UserExpose };
