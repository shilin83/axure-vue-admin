<script setup lang="ts">
import { Read } from "..";

const data = useObservable<User[], []>(from(liveQuery(async () => await userTable.toArray())), {
	initialValue: [],
});

const roles = useObservable<Role[], []>(
	from(liveQuery(async () => (await roleTable.toArray()).filter((item) => item.status))),
	{
		initialValue: [],
	},
);

const departments = useObservable<Department[], []>(
	from(liveQuery(async () => (await departmentTable.toArray()).filter((item) => item.status))),
	{
		initialValue: [],
	},
);
</script>

<template>
	<Layout :active="MENU_KEY.USER">
		<Read :data="data" :roles="roles" :departments="departments" />
	</Layout>
</template>
