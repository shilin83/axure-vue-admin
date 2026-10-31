<script setup lang="ts">
import { TableData } from "..";

const menuList = useObservable<Menu[], []>(from(liveQuery(async () => buildTree<Menu>(await menuTable.toArray()))), {
	initialValue: [],
});

const permissionList = useObservable<Permission[], []>(
	from(liveQuery(async () => buildTree<Permission>(await permissionTable.toArray()))),
	{
		initialValue: [],
	},
);

const roleList = useObservable<Role[], []>(from(liveQuery(async () => await roleTable.toArray())), {
	initialValue: [],
});

const dataList = computed<Role[]>(() => roleList.value.filter((item) => item.deletedAt === undefined));
const recycledList = computed<Role[]>(() => roleList.value.filter((item) => item.deletedAt !== undefined));
</script>

<template>
	<Layout :active="ROUTE_KEY.ROLE">
		<TableData :data="dataList" :recycled="recycledList" :menus="menuList" :permissions="permissionList" />
	</Layout>
</template>
