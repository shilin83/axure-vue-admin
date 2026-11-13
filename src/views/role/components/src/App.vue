<script setup lang="ts">
import { Read } from "..";

const data = useObservable<Role[], []>(from(liveQuery(async () => await roleTable.toArray())), {
	initialValue: [],
});

const menus = useObservable<Menu[], []>(from(liveQuery(async () => buildTree(await menuTable.toArray()))), {
	initialValue: [],
});

const permissions = useObservable<Permission[], []>(
	from(liveQuery(async () => buildTree(await permissionTable.toArray()))),
	{
		initialValue: [],
	},
);
</script>

<template>
	<Layout :active="MENU_KEY.ROLE">
		<Read :data="data" :menus="menus" :permissions="permissions" />
	</Layout>
</template>
