import List from "./components/List.vue";

const App = defineComponent(
	() => {
		const data = useObservable<Menu[], []>(from(liveQuery(async () => buildTree(await menuTable.toArray()))), {
			initialValue: [],
		});

		return () => (
			<Layout active={MENU_KEY.MENU}>
				<List data={data.value} />
			</Layout>
		);
	},
	{
		name: firstUpper(MENU_KEY.MENU),
	},
);

createApp(App).mount(createRoot());
