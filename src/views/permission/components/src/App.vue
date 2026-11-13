<script setup lang="ts">
import { Read } from "..";

const data = useObservable<Permission[], []>(from(liveQuery(async () => buildTree(await permissionTable.toArray()))), {
	initialValue: [],
});
</script>

<template>
	<Layout :active="MENU_KEY.PERMISSION">
		<Read :data="data" />
	</Layout>
</template>
