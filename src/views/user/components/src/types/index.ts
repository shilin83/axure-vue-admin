type UserExpose = {
	open: (row?: User) => void;
};

interface UserProps {
	data: User[];
	roles: Role[];
	departments: Department[];
}

export type { UserExpose, UserProps };
