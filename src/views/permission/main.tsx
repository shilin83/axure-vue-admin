import List from "./components/List.vue";

const App = defineComponent(
	() => {
		const data = useObservable<Permission[], []>(
			from(liveQuery(async () => buildTree(await permissionTable.toArray()))),
			{
				initialValue: [],
			},
		);

		return () => (
			<Layout active={MENU_KEY.PERMISSION}>
				<List data={data.value} />
			</Layout>
		);
	},
	{
		name: firstUpper(MENU_KEY.PERMISSION),
	},
);

createApp(App).mount(createRoot());
