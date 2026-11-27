import Metric from "./components/Metric.vue";
import Rank from "./components/Rank.vue";
import Sale from "./components/Sale.vue";

const App = defineComponent(
	() => {
		return () => (
			<Layout active={MENU_KEY.HOME}>
				<div class="grid-(~ rows-[auto_1fr_auto]) h-full gap-5 p-5">
					<Metric />
					<Sale />
					<Rank />
				</div>
			</Layout>
		);
	},
	{
		name: firstUpper(MENU_KEY.HOME),
	},
);

createApp(App).mount(createRoot());
