<script setup lang="ts">
import type { MonthValue, RankRow } from "./types";

import {
	BarChart,
	CanvasRenderer,
	FORMAT_DATE,
	GridComponent,
	LegendComponent,
	MONTH_STR,
	PieChart,
	STYLE_VALUE,
	TooltipComponent,
	VChart,
	disabledFutureMonth,
	formatShortName,
	generateRankRows,
	use,
} from "./helpers";

use([TooltipComponent, LegendComponent, GridComponent, BarChart, PieChart, CanvasRenderer]);

const barColors = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ef4444"];
const lastMonthStr = dayjs().subtract(1, MONTH_STR).format(FORMAT_DATE);
const volumeRows = ref<RankRow[]>([]);
const amountRows = ref<RankRow[]>([]);
const volumeMonth = ref<MonthValue>(lastMonthStr);
const amountMonth = ref<MonthValue>(lastMonthStr);
const topVolumeRows = computed(() => [...volumeRows.value].sort((a, b) => b.volume - a.volume).slice(0, 5));
const topAmountRows = computed(() => [...amountRows.value].sort((a, b) => b.amount - a.amount).slice(0, 5));
const refreshVolumeByMonth = (): RankRow[] => (volumeRows.value = generateRankRows());
const refreshAmountByMonth = (): RankRow[] => (amountRows.value = generateRankRows());

const volumeOption = computed(() => ({
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow",
		},
		formatter: (params: any) => {
			const p = params?.[0];
			if (!p) return "";

			return `${p.name}<br/>${p.marker} 销量：${p.value}`;
		},
	},
	grid: {
		left: 0,
		right: 0,
		top: 0,
		bottom: 20,
		containLabel: true,
	},
	xAxis: {
		type: "category",
		data: topVolumeRows.value.map((i) => i.name),
		axisTick: {
			show: false,
		},
		axisLine: {
			lineStyle: {
				color: "#e5e7eb",
			},
		},
		axisLabel: {
			color: "#6b7280",
			interval: 0,
			rotate: 20,
			formatter: (value: string) => formatShortName(value, 8),
		},
	},
	yAxis: {
		type: "value",
		axisLabel: {
			color: "#9ca3af",
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
			type: "bar",
			data: topVolumeRows.value.map((i) => i.volume),
			barWidth: 18,
			showBackground: true,
			backgroundStyle: {
				color: "#f3f4f6",
			},
			itemStyle: {
				borderRadius: [6, 6, 0, 0],
				color: (p: any) => barColors[p.dataIndex % barColors.length],
			},
			label: {
				show: true,
				position: "top",
				color: "#374151",
				fontWeight: 600,
			},
		},
	],
}));

const amountOption = computed(() => ({
	tooltip: {
		trigger: "item",
		formatter: (p: any) => `${p.marker} ${p.name}<br/>销售额：${p.value} 万<br/>占比：${p.percent}%`,
	},
	legend: {
		type: "scroll",
		orient: "vertical",
		right: 0,
		top: "center",
		textStyle: {
			color: "#6b7280",
		},
	},
	series: [
		{
			type: "pie",
			radius: ["45%", "70%"],
			center: ["35%", "50%"],
			avoidLabelOverlap: true,
			itemStyle: {
				borderRadius: 8,
				borderColor: "#fff",
				borderWidth: 2,
			},
			label: {
				show: false,
			},
			labelLine: {
				show: false,
			},
			data: topAmountRows.value.map((i) => ({
				name: i.name,
				value: i.amount,
			})),
		},
	],
}));

const rankCards = reactive([
	{
		title: "销量 TOP5",
		month: volumeMonth,
		option: volumeOption,
	},
	{
		title: "销售额 TOP5",
		month: amountMonth,
		option: amountOption,
	},
]);

watch(
	[volumeMonth, amountMonth],
	() => {
		refreshVolumeByMonth();
		refreshAmountByMonth();
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<div class="grid-(~ cols-1) lg:grid-(~ cols-2) gap-5">
		<div v-for="card in rankCards" :key="card.title" class="flex-y rounded-lg bg-white p-5">
			<div class="flex-center-x pointer-events-none mb-5 justify-between">
				<h2 class="text-(lg gray-800) font-600 leading-none">{{ card.title }}</h2>
				<ElDatePicker
					v-model="card.month"
					size="small"
					:clearable="false"
					:style="STYLE_VALUE"
					:type="MONTH_STR"
					:format="FORMAT_DATE"
					:valueFormat="FORMAT_DATE"
					:disabledDate="disabledFutureMonth"
				/>
			</div>
			<div class="h-80 max-w-[calc(100vw-200px)]">
				<VChart :option="card.option" autoresize />
			</div>
		</div>
	</div>
</template>
