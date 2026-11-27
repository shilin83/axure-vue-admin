import { faker } from "@faker-js/faker/locale/zh_CN";
import { BarChart, PieChart, LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

export {
	BarChart,
	CanvasRenderer,
	GridComponent,
	LegendComponent,
	LineChart,
	PieChart,
	TitleComponent,
	TooltipComponent,
	VChart,
	faker,
	use,
};
