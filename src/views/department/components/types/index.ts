interface DepartmentProps {
	data: Department[];
}

type DepartmentExpose = {
	open: (row?: Department) => void;
};

export type { DepartmentProps, DepartmentExpose };
