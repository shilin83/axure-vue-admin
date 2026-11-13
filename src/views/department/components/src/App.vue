<script setup lang="ts">
import { Read } from "..";

const data = useObservable<Department[], []>(from(liveQuery(async () => await departmentTable.toArray())), {
	initialValue: [],
});
</script>

<template>
	<Layout :active="MENU_KEY.DEPARTMENT">
		<Read :data="data" />
	</Layout>
</template>
