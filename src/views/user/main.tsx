import List from "./components/List.vue";

const App = defineComponent(
	() => {
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

		return () => (
			<Layout active={MENU_KEY.USER}>
				<List data={data.value} roles={roles.value} departments={departments.value} />
			</Layout>
		);
	},
	{
		name: firstUpper(MENU_KEY.USER),
	},
);

createApp(App).mount(createRoot());
