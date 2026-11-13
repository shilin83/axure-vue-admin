<script setup lang="ts">
import {
	CanvasRenderer,
	FORMAT_DATE,
	GridComponent,
	LegendComponent,
	LineChart,
	MONTH_STR,
	STYLE_VALUE,
	TitleComponent,
	TooltipComponent,
	VChart,
	disabledDate,
	generateChartData,
	use,
} from "./helpers";

use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, LineChart, CanvasRenderer]);

const currentMonthDate = ref(dayjs().subtract(1, MONTH_STR).format(FORMAT_DATE));
const chartData = ref(generateChartData(currentMonthDate.value));

const chartOption = computed(() => ({
	tooltip: {
		trigger: "axis",
		formatter: (params: any) => {
			let result = `${params[0].axisValue}<br/>`;

			params.forEach((param: any) => (result += `${param.marker} ${param.seriesName}: ${param.value}万<br/>`));

			return result;
		},
	},
	legend: {
		data: ["预计", "实际"],
		right: "center",
		top: 0,
		icon: "rect",
		itemWidth: 12,
		itemHeight: 4,
		textStyle: {
			color: "#9ca3af",
		},
	},
	grid: {
		left: 0,
		right: 0,
		bottom: 0,
		top: "40",
		containLabel: true,
	},
	xAxis: {
		type: "category",
		boundaryGap: false,
		data: chartData.value.dates,
		axisLine: {
			lineStyle: {
				color: "#e5e7eb",
			},
		},
		axisLabel: {
			color: "#9ca3af",
			margin: 15,
		},
		axisTick: {
			show: true,
			lineStyle: {
				color: "#e5e7eb",
			},
		},
	},
	yAxis: {
		type: "value",
		min: 0,
		max: 100,
		interval: 20,
		axisLabel: {
			color: "#9ca3af",
			formatter: "{value}万",
		},
		splitLine: {
			lineStyle: {
				type: "dashed",
				color: "#f3f4f6",
			},
		},
	},
	series: [
		{
			name: "预计",
			type: "line",
			data: chartData.value.forecastData,
			smooth: false,
			symbol: "none",
			lineStyle: {
				color: "#3b82f6",
				width: 2,
			},
			areaStyle: {
				color: {
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{
							offset: 0,
							color: "rgba(59, 130, 246, 0.2)",
						},
						{
							offset: 1,
							color: "rgba(59, 130, 246, 0)",
						},
					],
				},
			},
		},
		{
			name: "实际",
			type: "line",
			data: chartData.value.actualData,
			smooth: false,
			symbol: "none",
			lineStyle: {
				color: "#22c55e",
				width: 2,
			},
			areaStyle: {
				color: {
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{
							offset: 0,
							color: "rgba(34, 197, 94, 0.2)",
						},
						{
							offset: 1,
							color: "rgba(34, 197, 94, 0)",
						},
					],
				},
			},
		},
	],
}));

watch(currentMonthDate, (newMonth) => (chartData.value = generateChartData(newMonth)));
</script>

<template>
	<div class="flex-y rounded-lg bg-white p-5">
		<div class="flex-center-x pointer-events-none justify-between">
			<h2 class="text-(lg gray-800) font-600">销售趋势</h2>
			<ElDatePicker
				v-model="currentMonthDate"
				size="small"
				:clearable="false"
				:style="STYLE_VALUE"
				:type="MONTH_STR"
				:format="FORMAT_DATE"
				:valueFormat="FORMAT_DATE"
				:disabledDate="disabledDate"
			/>
		</div>
		<div class="min-h-[300px] max-w-[calc(100vw-200px)] flex-1">
			<VChart :option="chartOption" autoresize />
		</div>
	</div>
</template>
