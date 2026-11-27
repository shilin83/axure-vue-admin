import List from "./components/List.vue";

const App = defineComponent(
	() => {
		const data = useObservable<Department[], []>(from(liveQuery(async () => await departmentTable.toArray())), {
			initialValue: [],
		});

		return () => (
			<Layout active={MENU_KEY.DEPARTMENT}>
				<List data={data.value} />
			</Layout>
		);
	},
	{
		name: firstUpper(MENU_KEY.DEPARTMENT),
	},
);

createApp(App).mount(createRoot());
