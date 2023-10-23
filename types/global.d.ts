declare type DataSet = {
	number: string;
	primeForm: string;
	vec: string;
	z: null | string;
	complement: null | string;
};

declare type Props = "number" | "primeForm" | "vec" | "z" | "complement";

declare type FlatData = { [key: string]: (null | string)[] };

declare type D3Data = { [key: string]: Links | Dag };

declare type Links = { source: string; target: string }[];

declare type Dag = {
	size: { width: number; height: number };
	nodes: { x: number; y: number; data: string }[];
	links: { source: string; target: string; points: number[][]; data: Links };
	v: number;
};
