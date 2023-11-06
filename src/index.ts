import dotenv from "dotenv";
import express from "express";
import serverless from "serverless-http";
import rateLimit from "express-rate-limit";
import cors from "cors";
import fs from "fs";

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
// https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
app.set("trust proxy", 1);
// app.get("/ip", (request, response) => response.send(request.ip));
// app.get("/x-forwarded-for", (request, response) =>
// 	response.send(request.headers["x-forwarded-for"])
// );
dotenv.config();

const RATE_LIMIT: number = 500;

const limiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 1 day
	max: RATE_LIMIT, // Limit each IP to 500 requests per `window`
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: `Too many requests, please try again later. Current rate limit: ${RATE_LIMIT} requests per day`
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

let dataCache: DataSet[];
let globalFilter: string[] = [];

const flatData: FlatData = {};
const d3Data: D3Data = {};

const d3 = [
	"cardinal,inversion,dag",
	"cardinal,inversion,links",
	"cardinal,original,dag",
	"cardinal,original,links",
	"strict,inversion,dag",
	"strict,inversion,links",
	"strict,original,dag",
	"strict,original,links",
	"vector,inversion,dag",
	"vector,inversion,links",
	"vector,original,dag",
	"vector,original,links"
];

const readFiles = () => {
	setSetClasses();

	d3.forEach((s: string) => {
		const arr = s.split(",");
		if (arr.length === 3) {
			setD3(arr[0], arr[1], arr[2]);
		}
	});
};

const setSetClasses = () => {
	const data = fs.readFileSync("./data/set_classes.json", "utf8");
	dataCache = JSON.parse(data);
	flatData["prop"] = ["number", "primeForm", "vec", "z", "complement", "inversion"];
	flatData.prop.forEach(prop => {
		flatData[prop as Props] = dataCache.map(e => e[prop as Props]);
	});
};

const setD3 = (connectionType: string, nodeType: string, jsonType: string) => {
	const data = fs.readFileSync(`./data/d3/${connectionType}${nodeType}${jsonType}.json`, "utf8");
	d3Data[connectionType + nodeType + jsonType] = JSON.parse(data);
};

// formatArrToString should be used for primeForm, vec, and inversion
const filterFunc = (
	q: string,
	prop: string,
	options: FilterOptions = { formatArrToString: false, vecInequality: "e" }
) => {
	const { formatArrToString = false, vecInequality = "e" } = options;
	q = q.replace(/ /g, ""); // clears whitespace and also allows input of the empty string

	const isNotFlag = q.startsWith("!");
	if (isNotFlag) q = q.slice(1);

	const isExcludeFlag = q.startsWith("`");
	if (isExcludeFlag) q = q.slice(1);

	const formatString = (s: string) => {
		return s.replace(/T/g, "10").replace(/E/g, "11").replace(/C/g, "12");
	};

	const filterInequality = (leftStr: string, rightStr: string) => {
		const left = parseInt(formatString(leftStr));
		const right = parseInt(formatString(rightStr));

		if ((!left && left !== 0) || (!right && right !== 0)) {
			return false;
		}

		switch (vecInequality) {
			case "g":
				return left > right;
			case "l":
				return left < right;
			case "ge":
				return left >= right;
			case "le":
				return left <= right;
			case "e":
				return left === right;
			default:
				return false;
		}
	};

	const conditionFunc = (() => {
		switch (true) {
			case q === "null":
				return (e: StrObj) => e[prop] === null;
			case q.startsWith("^"):
				return (e: StrObj) =>
					e[prop] &&
					(formatArrToString ? e[prop].replace(/(?![TEC])\D/g, "") : e[prop]).startsWith(
						q.slice(1)
					);
			case q.endsWith("$"):
				return (e: StrObj) =>
					e[prop] &&
					(formatArrToString ? e[prop].replace(/(?![TEC])\D/g, "") : e[prop]).endsWith(
						q.slice(0, -1)
					);
			case q.startsWith("@"):
				return (e: StrObj) =>
					q
						.slice(1)
						.split("")
						.every(
							c =>
								e[prop] &&
								(formatArrToString ? e[prop].replace(/(?![TEC])\D/g, "") : e[prop]).includes(c)
						);
			case prop === "vec" && q.length === 6:
				// for vec examples: 111111, 1XXXXX, !111111, !1XXXXX
				// note that ! is removed beforehand
				return (e: StrObj) =>
					q
						.split("")
						.every(
							(c, i) =>
								c === "X" || filterInequality(e[prop].replace(/(?![TEC])\D/g, "").charAt(i), c)
						);
			default:
				return (e: StrObj) =>
					e[prop] && (formatArrToString ? e[prop].replace(/(?![TEC])\D/g, "") : e[prop]) === q;
		}
	})();

	return (e: StrObj) => {
		const res = conditionFunc(e);

		// if res is true add to global

		// add a flag to filter out duplicates later, if they are readded in another query
		if (isNotFlag && res) {
			globalFilter.push(JSON.stringify(e));
		} else if (isExcludeFlag && res) {
			globalFilter.push(JSON.stringify(e));
			return false;
		}

		return isNotFlag ? !res : res;
	};
};

readFiles();

app.get("/api/data", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	res.status(200).send(dataCache);
});

app.get("/api/data/:queryProp/", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const tempDataCache = structuredClone(dataCache);

	const { queryProp } = req.params;
	if (queryProp.length > 43) return res.status(414).send("URI Too Long: 43 characters or less");

	for (const p of queryProp.split(",")) {
		if (p.length < 1 || p.length > 10)
			return res.status(400).send("Bad Request: Subqueries Must Be 1-10 Characters Long");
		if (!flatData.prop.includes(p)) return res.status(400).send("Bad Request: Incorrect Property");
	}

	const propsToRemove = flatData.prop.filter(p => !queryProp.split(",").includes(p));

	for (const d of tempDataCache) {
		for (const p of propsToRemove) {
			delete d[p as Props];
		}
	}

	res.status(200).send(tempDataCache);
});

app.get("/api/flatdata/:queryProp/", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { queryProp } = req.params;
	if (queryProp.length > 10) return res.status(414).send("URI Too Long: 10 characters or less");

	if (!flatData.prop.includes(queryProp))
		return res.status(400).send("Bad Request: Incorrect Property");

	res.status(200).send(flatData[queryProp]);
});

app.get("/api/hashdata/:queryPropKey/:queryPropValue", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { queryPropKey, queryPropValue } = req.params;
	if (queryPropKey.length > 10)
		return res.status(414).send("URI Too Long (First Query): 10 characters or less");
	if (queryPropValue.length > 10)
		return res.status(414).send("URI Too Long (Second Query): 10 characters or less");

	if (!flatData.prop.includes(queryPropKey))
		return res.status(400).send("Bad Request (First Query): Incorrect Property");

	if (!flatData.prop.includes(queryPropValue))
		return res.status(400).send("Bad Request (Second Query): Incorrect Property");

	const hashmap: HashMap = {};

	dataCache.forEach(e => (hashmap[e[queryPropKey as Props]] = e[queryPropValue as Props]));

	res.status(200).send(hashmap);
});

// query = 1-1 || ^1 || A$ || 2-1~3-1 (inclusive) || 1-1,2-1 || 2-1~3-1,1-1,^7,15A$ || !1-1,!2-1
app.get("/api/data/number/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "number";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 15)
			return res.status(400).send("Bad Request: Subqueries Must Be 2-15 Characters Long");
		const rangeStr = q.split("~");
		if (rangeStr.length === 2) {
			const isNotFlag = rangeStr[0].startsWith("!");
			if (isNotFlag) rangeStr[0] = rangeStr[0].slice(1);
			const isExcludeFlag = rangeStr[0].startsWith("`");
			if (isExcludeFlag) rangeStr[0] = rangeStr[0].slice(1);
			// reduce to find the indexes that match the rangeStr
			const range: number[] = dataCache.reduce(
				(acc, e, i) => (e[prop] === rangeStr[0] || e[prop] === rangeStr[1] ? acc.concat(i) : acc),
				[]
			);
			if (range.length === 2) {
				// slice by range, then add to set as a string
				if (isNotFlag) {
					dataCache
						.filter(e => !dataCache.slice(range[0], range[1] + 1).includes(e))
						.forEach(item => uniqueResults.add(JSON.stringify(item)));
					dataCache
						.filter(e => dataCache.slice(range[0], range[1] + 1).includes(e))
						.forEach(item => globalFilter.push(JSON.stringify(item)));
				} else if (isExcludeFlag) {
					dataCache
						.filter(e => dataCache.slice(range[0], range[1] + 1).includes(e))
						.forEach(item => globalFilter.push(JSON.stringify(item)));
				} else {
					dataCache
						.slice(range[0], range[1] + 1)
						.forEach(item => uniqueResults.add(JSON.stringify(item)));
				}
			} else {
				globalFilter = [];
				return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");
			}
		} else {
			// filter based on queries, then add to set as a string
			dataCache
				.filter(filterFunc(q, prop))
				.forEach(item => uniqueResults.add(JSON.stringify(item)));
		}
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = 1-1 || ^1 || A$ || 2-1~3-1 (inclusive) || 1-1,2-1 || 2-1~3-1,1-1,^7,15A$ || !1-1,!2-1
app.get("/api/data/:queryProp/number/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { queryProp } = req.params;
	if (queryProp.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	for (const p of queryProp.split(",")) {
		if (p.length < 1 || p.length > 10)
			return res.status(400).send("Bad Request: Subqueries Must Be 1-10 Characters Long");
		if (!flatData.prop.includes(p)) return res.status(400).send("Bad Request: Incorrect Property");
	}

	const prop = "number";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 15)
			return res.status(400).send("Bad Request: Subqueries Must Be 2-15 Characters Long");
		const rangeStr = q.split("~");
		if (rangeStr.length === 2) {
			const isNotFlag = rangeStr[0].startsWith("!");
			if (isNotFlag) rangeStr[0] = rangeStr[0].slice(1);
			const isExcludeFlag = rangeStr[0].startsWith("`");
			if (isExcludeFlag) rangeStr[0] = rangeStr[0].slice(1);
			// reduce to find the indexes that match the rangeStr
			const range: number[] = dataCache.reduce(
				(acc, e, i) => (e[prop] === rangeStr[0] || e[prop] === rangeStr[1] ? acc.concat(i) : acc),
				[]
			);
			if (range.length === 2) {
				// slice by range, then add to set as a string
				if (isNotFlag) {
					dataCache
						.filter(e => !dataCache.slice(range[0], range[1] + 1).includes(e))
						.forEach(item => uniqueResults.add(JSON.stringify(item)));
					dataCache
						.filter(e => dataCache.slice(range[0], range[1] + 1).includes(e))
						.forEach(item => globalFilter.push(JSON.stringify(item)));
				} else if (isExcludeFlag) {
					dataCache
						.filter(e => dataCache.slice(range[0], range[1] + 1).includes(e))
						.forEach(item => globalFilter.push(JSON.stringify(item)));
				} else {
					dataCache
						.slice(range[0], range[1] + 1)
						.forEach(item => uniqueResults.add(JSON.stringify(item)));
				}
			} else {
				globalFilter = [];
				return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");
			}
		} else {
			// filter based on queries, then add to set as a string
			dataCache
				.filter(filterFunc(q, prop))
				.forEach(item => uniqueResults.add(JSON.stringify(item)));
		}
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	const propsToRemove = flatData.prop.filter(p => !queryProp.split(",").includes(p));

	for (const d of filteredData) {
		for (const p of propsToRemove) {
			delete d[p as Props];
		}
	}

	res.status(200).send(filteredData);
});

// query = 0123, 01234
app.get("/api/data/primeForm/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "primeForm";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 1 || q.length > 14) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 1-14 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache
			.filter(filterFunc(q, prop, { formatArrToString: true }))
			.forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = 0123, 01234
app.get("/api/data/:queryProp/primeForm/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { queryProp } = req.params;
	if (queryProp.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	for (const p of queryProp.split(",")) {
		if (p.length < 1 || p.length > 10)
			return res.status(400).send("Bad Request: Subqueries Must Be 1-10 Characters Long");
		if (!flatData.prop.includes(p)) return res.status(400).send("Bad Request: Incorrect Property");
	}

	const prop = "primeForm";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 1 || q.length > 14) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 1-14 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache
			.filter(filterFunc(q, prop, { formatArrToString: true }))
			.forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	const propsToRemove = flatData.prop.filter(p => !queryProp.split(",").includes(p));

	for (const d of filteredData) {
		for (const p of propsToRemove) {
			delete d[p as Props];
		}
	}

	res.status(200).send(filteredData);
});

// query = 111111 || 1X1X1X, 210000
app.get("/api/data/vec/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "vec";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 8) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-8 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache
			.filter(filterFunc(q, prop, { formatArrToString: true }))
			.forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = 111111 || 1X1X1X, 210000
app.get("/api/data/:queryProp/vec/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { queryProp } = req.params;
	if (queryProp.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	for (const p of queryProp.split(",")) {
		if (p.length < 1 || p.length > 10)
			return res.status(400).send("Bad Request: Subqueries Must Be 1-10 Characters Long");
		if (!flatData.prop.includes(p)) return res.status(400).send("Bad Request: Incorrect Property");
	}

	const prop = "vec";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 8) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-8 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache
			.filter(filterFunc(q, prop, { formatArrToString: true }))
			.forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	const propsToRemove = flatData.prop.filter(p => !queryProp.split(",").includes(p));

	for (const d of filteredData) {
		for (const p of propsToRemove) {
			delete d[p as Props];
		}
	}

	res.status(200).send(filteredData);
});

// querySearch = 111111 || 1X1X1X, 210000 / queryInequality = g || l || ge || le
app.get("/api/data/vec/:querySearch/:queryInequality", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "vec";
	const { querySearch, queryInequality } = req.params;
	if (querySearch.length > 100)
		return res.status(414).send("URI Too Long (Search Query): 100 characters or less");
	if (queryInequality.length > 2)
		return res.status(414).send("URI Too Long (Inequality Query): 2 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 8) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-8 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache
			.filter(filterFunc(q, prop, { formatArrToString: true, vecInequality: queryInequality }))
			.forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found"); // can be due to bad inequality query

	res.status(200).send(filteredData);
});

// querySearch = 111111 || 1X1X1X, 210000 / queryInequality = g || l || ge || le
app.get("/api/data/:queryProp/vec/:querySearch/:queryInequality", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { queryProp } = req.params;
	if (queryProp.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	for (const p of queryProp.split(",")) {
		if (p.length < 1 || p.length > 10)
			return res.status(400).send("Bad Request: Subqueries Must Be 1-10 Characters Long");
		if (!flatData.prop.includes(p)) return res.status(400).send("Bad Request: Incorrect Property");
	}

	const prop = "vec";
	const { querySearch, queryInequality } = req.params;
	if (querySearch.length > 100)
		return res.status(414).send("URI Too Long (Search Query): 100 characters or less");
	if (queryInequality.length > 2)
		return res.status(414).send("URI Too Long (Inequality Query): 2 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 8) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-8 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache
			.filter(filterFunc(q, prop, { formatArrToString: true, vecInequality: queryInequality }))
			.forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found"); // can be due to bad inequality query

	const propsToRemove = flatData.prop.filter(p => !queryProp.split(",").includes(p));

	for (const d of filteredData) {
		for (const p of propsToRemove) {
			delete d[p as Props];
		}
	}

	res.status(200).send(filteredData);
});

// query = null || 4-z29A || ^4 || A$ || 4-z29A, 4-z29B, !1-1
app.get("/api/data/z/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "z";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 8) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-8 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache.filter(filterFunc(q, prop)).forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = null || 4-z29A || ^4 || A$ || 4-z29A, 4-z29B, !1-1
app.get("/api/data/:queryProp/z/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { queryProp } = req.params;
	if (queryProp.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	for (const p of queryProp.split(",")) {
		if (p.length < 1 || p.length > 10)
			return res.status(400).send("Bad Request: Subqueries Must Be 1-10 Characters Long");
		if (!flatData.prop.includes(p)) return res.status(400).send("Bad Request: Incorrect Property");
	}

	const prop = "z";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 8) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-8 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache.filter(filterFunc(q, prop)).forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	const propsToRemove = flatData.prop.filter(p => !queryProp.split(",").includes(p));

	for (const d of filteredData) {
		for (const p of propsToRemove) {
			delete d[p as Props];
		}
	}

	res.status(200).send(filteredData);
});

// query = null || 4-z29A || ^4 || A$ || 4-z29A, 4-z29B, !1-1
app.get("/api/data/complement/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "complement";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 8) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-8 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache.filter(filterFunc(q, prop)).forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = null || 4-z29A || ^4 || A$ || 4-z29A, 4-z29B, !1-1
app.get("/api/data/:queryProp/complement/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { queryProp } = req.params;
	if (queryProp.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	for (const p of queryProp.split(",")) {
		if (p.length < 1 || p.length > 10)
			return res.status(400).send("Bad Request: Subqueries Must Be 1-10 Characters Long");
		if (!flatData.prop.includes(p)) return res.status(400).send("Bad Request: Incorrect Property");
	}

	const prop = "complement";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 8) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-8 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache.filter(filterFunc(q, prop)).forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	const propsToRemove = flatData.prop.filter(p => !queryProp.split(",").includes(p));

	for (const d of filteredData) {
		for (const p of propsToRemove) {
			delete d[p as Props];
		}
	}

	res.status(200).send(filteredData);
});

// query = null, 0123, 01234
app.get("/api/data/inversion/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "inversion";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 14) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-14 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache
			.filter(filterFunc(q, prop, { formatArrToString: true }))
			.forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = null, 0123, 01234
app.get("/api/data/:queryProp/inversion/:querySearch", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { queryProp } = req.params;
	if (queryProp.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	for (const p of queryProp.split(",")) {
		if (p.length < 1 || p.length > 10)
			return res.status(400).send("Bad Request: Subqueries Must Be 1-10 Characters Long");
		if (!flatData.prop.includes(p)) return res.status(400).send("Bad Request: Incorrect Property");
	}

	const prop = "inversion";
	const { querySearch } = req.params;
	if (querySearch.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of querySearch.split(",")) {
		if (q.length < 2 || q.length > 14) {
			globalFilter = [];
			return res.status(400).send("Bad Request: Subqueries Must Be 2-14 Characters Long");
		}
		// filter based on queries, then add to set as a string
		dataCache
			.filter(filterFunc(q, prop, { formatArrToString: true }))
			.forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults]
		.filter(e => !globalFilter.includes(e))
		.map(itemStr => JSON.parse(itemStr));

	globalFilter = [];

	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	const propsToRemove = flatData.prop.filter(p => !queryProp.split(",").includes(p));

	for (const d of filteredData) {
		for (const p of propsToRemove) {
			delete d[p as Props];
		}
	}

	res.status(200).send(filteredData);
});

// query = cardinaldaginversions || strictdaginversions || cardinallinkinversions || strictlinkinversions
app.get("/api/data/d3/:querySearch", (req, res) => {
	const { querySearch } = req.params;
	if (querySearch.length > 22) return res.status(414).send("URI Too Long: 22 characters or less");
	const ret = d3Data[querySearch];

	if (!d3.map((s: string) => s.replace(/,/g, "")).includes(querySearch)) {
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");
	}

	if (!d3Data[querySearch]) return res.sendStatus(500);

	res.status(200).send(ret);
});

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});
export default app;
export const handler = serverless(app);
