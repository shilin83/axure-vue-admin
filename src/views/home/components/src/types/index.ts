type MonthValue = Nullable<string>;

interface RankRow {
	name: string;
	volume: number;
	amount: number;
}

interface ChartData {
	dates: string[];
	forecastData: number[];
	actualData: number[];
}

interface MetricProps {
	title: string;
	value: string;
	percent: string;
	icon: string;
	color: string;
}

export type { MetricProps, MonthValue, RankRow, ChartData };
