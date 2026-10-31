<script setup lang="ts">
import { TableData } from "..";

const roleList = useObservable<Role[], []>(
	from(liveQuery(async () => (await roleTable.toArray()).filter((item) => item.deletedAt === undefined))),
	{
		initialValue: [],
	},
);

const departmentList = useObservable<Department[], []>(
	from(liveQuery(async () => (await departmentTable.toArray()).filter((item) => item.deletedAt === undefined))),
	{
		initialValue: [],
	},
);

const userList = useObservable<User[], []>(from(liveQuery(async () => await userTable.toArray())), {
	initialValue: [],
});

const dataList = computed<User[]>(() => userList.value.filter((item) => item.deletedAt === undefined));
const recycledList = computed<User[]>(() => userList.value.filter((item) => item.deletedAt !== undefined));
</script>

<template>
	<Layout :active="ROUTE_KEY.USER">
		<TableData :data="dataList" :recycled="recycledList" :roles="roleList" :departments="departmentList" />
	</Layout>
</template>
