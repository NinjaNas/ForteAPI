import dotenv from "dotenv";
import express from "express";
import serverless from "serverless-http";
import rateLimit from "express-rate-limit";
import cors from "cors";
import fs from "fs/promises";

const app = express();
// const port = process.env.PORT || 8080;
app.use(cors());
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

type DataSet = {
	number: string;
	primeForm: string;
	vec: string;
	z: null | string;
	complement: null | string;
};

type props = "number" | "primeForm" | "vec" | "z" | "complement";

let dataCache: DataSet[];

const flatData: { [key: string]: (null | string)[] } = {};

fs.readFile("./data/set_classes.json", "utf8")
	.then(data => {
		dataCache = JSON.parse(data);
		flatData["prop"] = ["number", "primeForm", "vec", "z", "complement"];
		flatData.prop.forEach(prop => {
			flatData[prop as props] = dataCache.map(e => e[prop as props]);
		});
	})
	.catch(err => {
		console.error("Error reading the data file:", err);
	});

const filterFunc = (q: string, prop: string) => {
	if (q === "null") {
		return (e: { [key: string]: string }) => e[prop] === null;
	} else if (q.at(0) === "^" && q.at(-1) === "$") {
		return (e: { [key: string]: string }) => e[prop] === q.slice(1, q.length - 1);
	} else if (q.at(0) === "^") {
		return (e: { [key: string]: string }) => e[prop] && e[prop].startsWith(q.slice(1));
	} else if (q.at(-1) === "$") {
		return (e: { [key: string]: string }) => e[prop] && e[prop].endsWith(q.slice(0, q.length - 1));
	} else {
		return (e: { [key: string]: string }) => e[prop] === q;
	}
};

app.get("/api/data", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	res.status(200).send(dataCache);
});

app.get("/api/data/:prop/", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const tempDataCache = structuredClone(dataCache);

	const { prop } = req.params;
	if (prop.length > 33) return res.status(414).send("URI Too Long: 33 characters or less");

	const propSplit = prop.split(",");

	for (const p of propSplit) {
		if (!flatData.prop.includes(p)) return res.status(400).send("Bad Request: Incorrect Property");
	}

	const propsToRemove = flatData.prop.filter(p => !propSplit.includes(p));

	for (const d of tempDataCache) {
		for (const p of propsToRemove) {
			delete d[p as props];
		}
	}

	res.status(200).send(tempDataCache);
});

app.get("/api/flatdata/:prop/", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const { prop } = req.params;
	if (!flatData.prop.includes(prop)) return res.status(400).send("Bad Request: Incorrect Property");

	res.status(200).send(flatData[prop]);
});

// query = 1-1 || ^1 || A$ || 2-1~3-1 (inclusive) || 1-1,2-1 || 2-1~3-1,1-1,^7,15A$
app.get("/api/data/number/:query", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "number";
	const { query } = req.params;
	if (query.length > 100) return res.status(414).send("URI Too Long: 100 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of query.split(",")) {
		const rangeStr = q.split("~");
		if (rangeStr.length === 2) {
			// reduce to find the indexes that match the rangeStr
			const range: number[] = dataCache.reduce(
				(acc, e, i) => (e[prop] === rangeStr[0] || e[prop] === rangeStr[1] ? acc.concat(i) : acc),
				[]
			);
			if (range.length === 2) {
				// slice by range, then add to set as a string
				dataCache
					.slice(range[0], range[1] + 1)
					.forEach(item => uniqueResults.add(JSON.stringify(item)));
			} else {
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
	const filteredData: DataSet[] = [...uniqueResults].map(itemStr => JSON.parse(itemStr));
	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = [0,1,2,3] || 0123 (fuzzy)
app.get("/api/data/primeForm/:query", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "primeForm";
	const { query } = req.params;
	if (query.length > 25) return res.status(414).send("URI Too Long: 25 characters or less");

	const filteredData: DataSet[] =
		query.at(0) === "[" && query.at(-1) === "]"
			? dataCache.filter(e => e[prop] === JSON.stringify(query.slice(1, -1).split(",")))
			: dataCache.filter(
					e =>
						!query.includes(",") && query.split("").every(val => JSON.parse(e[prop]).includes(val))
			  );

	// spread set into an array then convert back to JSON
	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = <1,1,1,1,1,1> || 111111 || 1X1X1X
app.get("/api/data/vec/:query", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "vec";
	const { query } = req.params;
	if (query.length > 13) return res.status(414).send("URI Too Long: 13 characters or less");

	const filteredData: DataSet[] =
		query.at(0) === "<" && query.at(-1) === ">"
			? dataCache.filter(e => e[prop] === query)
			: dataCache.filter(
					e =>
						query.length === 6 &&
						query.split("").every((val, i) => val === "X" || e[prop].charAt(1 + 2 * i) === val)
			  );

	// spread set into an array then convert back to JSON
	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = null || 4-z29A || ^4 || A$
app.get("/api/data/z/:query", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "z";
	const { query } = req.params;
	if (query.length > 8) return res.status(414).send("URI Too Long: 8 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of query.split(",")) {
		// filter based on queries, then add to set as a string
		dataCache.filter(filterFunc(q, prop)).forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults].map(itemStr => JSON.parse(itemStr));
	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// query = null || 4-z29A || ^4 || A$
app.get("/api/data/complement/:query", (req, res) => {
	if (!dataCache) return res.sendStatus(500);

	const prop = "complement";
	const { query } = req.params;
	if (query.length > 8) return res.status(414).send("URI Too Long: 8 characters or less");

	const uniqueResults = new Set<string>();

	for (const q of query.split(",")) {
		// filter based on queries, then add to set as a string
		dataCache.filter(filterFunc(q, prop)).forEach(item => uniqueResults.add(JSON.stringify(item)));
	}

	// spread set into an array then convert back to JSON
	const filteredData: DataSet[] = [...uniqueResults].map(itemStr => JSON.parse(itemStr));
	if (!filteredData.length)
		return res.status(400).send("Bad Request: Incorrect Query or Query Not Found");

	res.status(200).send(filteredData);
});

// app.listen(port, () => {
// 	console.log(`server started at http://localhost:${port}`);
// });
export default app;
export const handler = serverless(app);
