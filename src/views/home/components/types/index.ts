interface ChartData {
	dates: string[];
	forecastData: number[];
	actualData: number[];
}

interface RankRow {
	name: string;
	volume: number;
	amount: number;
}

interface MetricProps {
	title: string;
	value: string;
	percent: string;
	icon: string;
	color: string;
}

type MonthValue = Nullable<string>;

export type { ChartData, RankRow, MetricProps, MonthValue };
