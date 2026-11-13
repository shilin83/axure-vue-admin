import type { RankRow, ChartData } from "../types";

import { faker } from "@faker-js/faker/locale/zh_CN";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

const MONTH_STR = "month";
const FORMAT_DATE = "YYYY-MM";

const STYLE_VALUE = {
	width: "100px",
	pointerEvents: "auto",
};

const FRESH_GOODS = [
	"智利车厘子JJ级 5kg原箱",
	"阳澄湖大闸蟹礼盒装",
	"澳洲原切M3眼肉牛排",
	"厄瓜多尔三文鱼原切中段",
	"海南佳沛椰子原箱 3kg",
	"丹东金钻燕窝果 100g",
	"新疆树上熟贵妃芒 2.5kg",
	"内蒙阿克苏苹果 5kg",
	"东海野生大黄鱼 500g",
	"宁夏桥头排骨 1kg",
	"云南蓝莓礼盒装 500g",
	"山东烟台红富士苹果 4.5kg",
	"广西百香果 2kg",
	"福建平和蜜柚 3kg",
	"广东湛江对虾 800g",
	"挪威三文鱼刺身拼盘 300g",
	"内蒙古羊排 1kg",
	"泰国金枕榴莲肉 500g",
	"新疆哈密瓜 2枚装",
	"东北有机玉米 10根装",
	"陕西洛川红富士 5kg",
	"赣南脐橙礼盒装 4kg",
	"云南松茸鲜品 250g",
	"大连海参即食装 300g",
	"山东乳山生蚝 30只装",
	"广西砂糖橘 3kg",
	"福建平潭小管鱿鱼 500g",
	"青岛啤酒原浆 1L*2",
	"舟山带鱼段 1kg",
	"江苏盐水鸭礼盒 1.2kg",
	"四川耙耙柑 2.5kg",
	"新疆红枣特级 1kg",
	"东北五常大米 5kg",
	"云南普洱茶饼 357g",
	"广东潮汕牛肉丸 500g",
	"宁波舟山梭子蟹 1kg",
	"福建龙岩香菇 500g",
	"安徽黄山毛峰 200g",
	"广西螺蛳粉 6袋装",
	"海南文昌鸡 1.5kg",
];

/**
 * 格式化商品名称，超过最大长度时以省略号截断
 *
 * @param name 商品名称
 * @param maxLen 最大长度（默认 10）
 *
 * @returns 格式化后的名称
 */
function formatShortName(name: string, maxLen = 10): string {
	if (name.length <= maxLen) return name;

	return `${name.slice(0, maxLen)}…`;
}

/**
 * 判断日期是否晚于最近月份（用于禁用未来月份选择）
 *
 * @param time 待判断的日期
 *
 * @returns 是否禁用
 */
function disabledFutureMonth(time: Date): boolean {
	return dayjs(time).startOf(MONTH_STR).isAfter(dayjs().subtract(1, MONTH_STR).startOf(MONTH_STR));
}

/**
 * 生成随机商品榜单数据（销量与销售额）
 *
 * @returns 榜单行数据列表
 */
function generateRankRows(): RankRow[] {
	const count = faker.number.int({
		min: 12,
		max: 16,
	});

	const picked = faker.helpers.arrayElements(FRESH_GOODS, count);
	return picked.map((name) => {
		const volume = faker.number.int({
			min: 120,
			max: 1200,
		});

		const amount = faker.number.float({
			min: 8,
			max: 220,
			fractionDigits: 2,
		});

		return {
			name,
			volume,
			amount,
		};
	});
}

/**
 * 将数值限制在指定区间内
 *
 * @param value 原始数值
 * @param min 区间下限
 * @param max 区间上限
 *
 * @returns 限制后的数值
 */
function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * 判断日期是否晚于最近月份（用于禁用未来月份选择）
 *
 * @param time 待判断的日期
 *
 * @returns 是否禁用
 */
function disabledDate(time: Date): boolean {
	return dayjs(time).startOf(MONTH_STR).isAfter(dayjs().startOf(MONTH_STR).subtract(1, MONTH_STR));
}

/**
 * 统计预测数据与实际数据曲线在相邻点间的交叉次数
 *
 * @param forecastData 预测数据序列
 * @param actualData 实际数据序列
 *
 * @returns 交叉次数
 */
function countCrossings(forecastData: number[], actualData: number[]): number {
	let crossings = 0;

	for (let i = 1; i < forecastData.length; i++) {
		const prevForecast = forecastData[i - 1];
		const prevActual = actualData[i - 1];
		const currForecast = forecastData[i];
		const currActual = actualData[i];

		if (
			prevForecast === undefined ||
			prevActual === undefined ||
			currForecast === undefined ||
			currActual === undefined
		)
			continue;

		const prev = prevForecast - prevActual;
		const curr = currForecast - currActual;
		if (prev === 0 || curr === 0) continue;

		if ((prev > 0 && curr < 0) || (prev < 0 && curr > 0)) crossings++;
	}

	return crossings;
}

/**
 * 根据月份生成随机销售预测与实际数据
 *
 * @param monthStr 月份字符串
 *
 * @returns 图表数据（月份、预测与实际序列）
 */
function generateChartData(monthStr: string): ChartData {
	let forecast = faker.number.int({
		min: 40,
		max: 60,
	});

	let error = faker.number.int({
		min: -8,
		max: 8,
	});

	const pickBias = (): number => {
		if (
			faker.number.float({
				min: 0,
				max: 1,
			}) < 0.72
		)
			return faker.number.int({
				min: 8,
				max: 26,
			});

		return faker.number.int({
			min: -20,
			max: -6,
		});
	};

	let bias = pickBias();

	let biasDaysLeft = faker.number.int({
		min: 4,
		max: 9,
	});

	const forecastData: number[] = [];
	const actualData: number[] = [];
	const targetDate = dayjs(monthStr);
	const daysInMonth = targetDate.daysInMonth();

	const dates = Array.from(
		{
			length: daysInMonth,
		},
		(_, i) => targetDate.date(i + 1).format("MM/DD"),
	);

	for (let i = 0; i < daysInMonth; i++) {
		const change = faker.number.int({
			min: -15,
			max: 15,
		});

		forecast = clamp(forecast + change, 10, 100);
		forecastData.push(forecast);

		biasDaysLeft -= 1;
		if (biasDaysLeft <= 0) {
			bias = pickBias();

			biasDaysLeft = faker.number.int({
				min: 5,
				max: 11,
			});
		}

		const shouldFlip =
			faker.number.float({
				min: 0,
				max: 1,
			}) < 0.16;

		const dailyNoise = faker.number.int({
			min: -4,
			max: 4,
		});

		error = shouldFlip
			? -error +
				faker.number.int({
					min: -10,
					max: 10,
				})
			: error +
				faker.number.int({
					min: -6,
					max: 6,
				});

		error = clamp(error, -16, 16);
		actualData.push(clamp(forecast + bias + error + dailyNoise, 10, 100));
	}

	if (daysInMonth >= 7) {
		const injectCrossingAt = (idx: number, delta: number): void => {
			const safeIdx = clamp(idx, 0, daysInMonth - 2);
			const f0 = forecastData[safeIdx];
			const f1 = forecastData[safeIdx + 1];
			if (f0 === undefined || f1 === undefined) return;

			actualData[safeIdx] = clamp(f0 + delta, 10, 100);
			actualData[safeIdx + 1] = clamp(f1 - delta, 10, 100);
		};

		const ensureBothSides = (): void => {
			let above = 0;
			let below = 0;

			for (let i = 0; i < daysInMonth; i++) {
				const f = forecastData[i];
				const a = actualData[i];
				if (f === undefined || a === undefined) continue;

				if (a > f) {
					above++;
				} else if (a < f) {
					below++;
				}
			}

			const minAbove = Math.max(5, Math.floor(daysInMonth * 0.45));
			const minBelow = Math.max(3, Math.floor(daysInMonth * 0.18));

			const deltaAbove = faker.number.int({
				min: 12,
				max: 22,
			});

			const deltaBelow = faker.number.int({
				min: 8,
				max: 18,
			});

			if (above < minAbove) {
				const needed = minAbove - above;
				for (let k = 0; k < needed; k++) {
					const idx = clamp(1 + k * 2, 0, daysInMonth - 1);
					const f = forecastData[idx];
					if (f === undefined) continue;

					actualData[idx] = clamp(f + deltaAbove, 10, 100);
				}
			}

			if (below < minBelow) {
				const needed = minBelow - below;
				for (let k = 0; k < needed; k++) {
					const idx = clamp(2 + k * 4, 0, daysInMonth - 1);
					const f = forecastData[idx];
					if (f === undefined) continue;

					actualData[idx] = clamp(f - deltaBelow, 10, 100);
				}
			}
		};

		ensureBothSides();

		const targetCrossings = faker.number.int({
			min: 1,
			max: 3,
		});

		let crossings = countCrossings(forecastData, actualData);
		if (crossings < targetCrossings) {
			const candidates: number[] = [];

			for (let i = 2; i < daysInMonth - 2; i++) {
				const current = forecastData[i];
				const next = forecastData[i + 1];
				if (current === undefined || next === undefined) continue;

				const ok = current > 25 && current < 85 && next > 25 && next < 85;
				if (ok) candidates.push(i);
			}

			const attempts = Math.min(4, candidates.length > 0 ? candidates.length : 1);
			for (let t = 0; t < attempts && crossings < targetCrossings; t++) {
				const idx =
					candidates.length > 0
						? (candidates[
								faker.number.int({
									min: 0,
									max: candidates.length - 1,
								})
							] ?? Math.floor(daysInMonth / 2))
						: Math.floor((daysInMonth * (t + 1)) / (attempts + 1));

				injectCrossingAt(
					idx,
					faker.number.int({
						min: 14,
						max: 22,
					}),
				);

				crossings = countCrossings(forecastData, actualData);
			}
		}
	}

	if (daysInMonth >= 7 && countCrossings(forecastData, actualData) === 0) {
		const candidates: number[] = [];

		for (let i = 2; i < daysInMonth - 2; i++) {
			const current = forecastData[i];
			const next = forecastData[i + 1];
			if (current === undefined || next === undefined) continue;

			const ok = current > 25 && current < 85 && next > 25 && next < 85;
			if (ok) candidates.push(i);
		}

		let idx = Math.floor(daysInMonth / 2);

		if (candidates.length > 0) {
			const pick = faker.number.int({
				min: 0,
				max: candidates.length - 1,
			});

			idx = candidates[pick] ?? idx;
		}

		idx = clamp(idx, 0, daysInMonth - 2);

		const f0 = forecastData[idx];
		const f1 = forecastData[idx + 1];
		if (f0 !== undefined && f1 !== undefined) {
			actualData[idx] = clamp(f0 + 10, 10, 100);
			actualData[idx + 1] = clamp(f1 - 10, 10, 100);
		}
	}

	return {
		dates,
		forecastData,
		actualData,
	};
}

export {
	FORMAT_DATE,
	MONTH_STR,
	STYLE_VALUE,
	VChart,
	faker,
	use,
	BarChart,
	CanvasRenderer,
	GridComponent,
	LegendComponent,
	LineChart,
	PieChart,
	TitleComponent,
	TooltipComponent,
	disabledDate,
	disabledFutureMonth,
	formatShortName,
	generateChartData,
	generateRankRows,
};
