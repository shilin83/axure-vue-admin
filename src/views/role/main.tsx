import List from "./components/List.vue";

const App = defineComponent(
	() => {
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

		return () => (
			<Layout active={MENU_KEY.ROLE}>
				<List data={data.value} menus={menus.value} permissions={permissions.value} />
			</Layout>
		);
	},
	{
		name: firstUpper(MENU_KEY.ROLE),
	},
);

createApp(App).mount(createRoot());
