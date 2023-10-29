import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/index";
const should = chai.should();
import fs from "fs";

chai.use(chaiHttp);

let dataCache: DataSet[];

const flatData: FlatData = {};
const d3Data: D3Data = {};

const d3 = [
	"cardinal,dag,inversions",
	"cardinal,link,inversions",
	"strict,dag,inversions",
	"strict,link,inversions"
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

const setD3 = (connectionType: string, jsonType: string, textType: string) => {
	const data = fs.readFileSync(
		`./data/d3/${connectionType}-increasing/${jsonType}s/${textType}.json`,
		"utf8"
	);
	d3Data[connectionType + jsonType + textType] = JSON.parse(data);
};

readFiles();

describe("GET /api/data/inversion/:querySearch", () => {
	it("should return 414 if uri is over length", done => {
		chai
			.request(server)
			.get(
				"/api/data/inversion/00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
			)
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(414);
				done();
			});
	});

	it("should return 400, wrong format", done => {
		chai
			.request(server)
			.get("/api/data/inversion/[0,3,7]")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, ^ query returns nothing", done => {
		chai
			.request(server)
			.get("/api/data/inversion/^00")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, $ query returns nothing", done => {
		chai
			.request(server)
			.get("/api/data/inversion/00$")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 200 and correct data, null", done => {
		chai
			.request(server)
			.get("/api/data/inversion/null")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "0-1",
						primeForm: '[""]',
						vec: "<0,0,0,0,0,0>",
						z: null,
						complement: "12-1",
						inversion: null
					},
					{
						number: "1-1",
						primeForm: '["0"]',
						vec: "<0,0,0,0,0,0>",
						z: null,
						complement: "11-1",
						inversion: null
					},
					{
						number: "2-1",
						primeForm: '["0","1"]',
						vec: "<1,0,0,0,0,0>",
						z: null,
						complement: "10-1",
						inversion: null
					},
					{
						number: "2-2",
						primeForm: '["0","2"]',
						vec: "<0,1,0,0,0,0>",
						z: null,
						complement: "10-2",
						inversion: null
					},
					{
						number: "2-3",
						primeForm: '["0","3"]',
						vec: "<0,0,1,0,0,0>",
						z: null,
						complement: "10-3",
						inversion: null
					},
					{
						number: "2-4",
						primeForm: '["0","4"]',
						vec: "<0,0,0,1,0,0>",
						z: null,
						complement: "10-4",
						inversion: null
					},
					{
						number: "2-5",
						primeForm: '["0","5"]',
						vec: "<0,0,0,0,1,0>",
						z: null,
						complement: "10-5",
						inversion: null
					},
					{
						number: "2-6",
						primeForm: '["0","6"]',
						vec: "<0,0,0,0,0,1>",
						z: null,
						complement: "10-6",
						inversion: null
					},
					{
						number: "3-1",
						primeForm: '["0","1","2"]',
						vec: "<2,1,0,0,0,0>",
						z: null,
						complement: "9-1",
						inversion: null
					},
					{
						number: "3-6",
						primeForm: '["0","2","4"]',
						vec: "<0,2,0,1,0,0>",
						z: null,
						complement: "9-6",
						inversion: null
					},
					{
						number: "3-9",
						primeForm: '["0","2","7"]',
						vec: "<0,1,0,0,2,0>",
						z: null,
						complement: "9-9",
						inversion: null
					},
					{
						number: "3-10",
						primeForm: '["0","3","6"]',
						vec: "<0,0,2,0,0,1>",
						z: null,
						complement: "9-10",
						inversion: null
					},
					{
						number: "3-12",
						primeForm: '["0","4","8"]',
						vec: "<0,0,0,3,0,0>",
						z: null,
						complement: "9-12",
						inversion: null
					},
					{
						number: "4-1",
						primeForm: '["0","1","2","3"]',
						vec: "<3,2,1,0,0,0>",
						z: null,
						complement: "8-1",
						inversion: null
					},
					{
						number: "4-3",
						primeForm: '["0","1","3","4"]',
						vec: "<2,1,2,1,0,0>",
						z: null,
						complement: "8-3",
						inversion: null
					},
					{
						number: "4-6",
						primeForm: '["0","1","2","7"]',
						vec: "<2,1,0,0,2,1>",
						z: null,
						complement: "8-6",
						inversion: null
					},
					{
						number: "4-7",
						primeForm: '["0","1","4","5"]',
						vec: "<2,0,1,2,1,0>",
						z: null,
						complement: "8-7",
						inversion: null
					},
					{
						number: "4-8",
						primeForm: '["0","1","5","6"]',
						vec: "<2,0,0,1,2,1>",
						z: null,
						complement: "8-8",
						inversion: null
					},
					{
						number: "4-9",
						primeForm: '["0","1","6","7"]',
						vec: "<2,0,0,0,2,2>",
						z: null,
						complement: "8-9",
						inversion: null
					},
					{
						number: "4-10",
						primeForm: '["0","2","3","5"]',
						vec: "<1,2,2,0,1,0>",
						z: null,
						complement: "8-10",
						inversion: null
					},
					{
						number: "4-17",
						primeForm: '["0","3","4","7"]',
						vec: "<1,0,2,2,1,0>",
						z: null,
						complement: "8-17",
						inversion: null
					},
					{
						number: "4-20",
						primeForm: '["0","1","5","8"]',
						vec: "<1,0,1,2,2,0>",
						z: null,
						complement: "8-20",
						inversion: null
					},
					{
						number: "4-21",
						primeForm: '["0","2","4","6"]',
						vec: "<0,3,0,2,0,1>",
						z: null,
						complement: "8-21",
						inversion: null
					},
					{
						number: "4-23",
						primeForm: '["0","2","5","7"]',
						vec: "<0,2,1,0,3,0>",
						z: null,
						complement: "8-23",
						inversion: null
					},
					{
						number: "4-24",
						primeForm: '["0","2","4","8"]',
						vec: "<0,2,0,3,0,1>",
						z: null,
						complement: "8-24",
						inversion: null
					},
					{
						number: "4-25",
						primeForm: '["0","2","6","8"]',
						vec: "<0,2,0,2,0,2>",
						z: null,
						complement: "8-25",
						inversion: null
					},
					{
						number: "4-26",
						primeForm: '["0","3","5","8"]',
						vec: "<0,1,2,1,2,0>",
						z: null,
						complement: "8-26",
						inversion: null
					},
					{
						number: "4-28",
						primeForm: '["0","3","6","9"]',
						vec: "<0,0,4,0,0,2>",
						z: null,
						complement: "8-28",
						inversion: null
					},
					{
						number: "5-1",
						primeForm: '["0","1","2","3","4"]',
						vec: "<4,3,2,1,0,0>",
						z: null,
						complement: "7-1",
						inversion: null
					},
					{
						number: "5-8",
						primeForm: '["0","2","3","4","6"]',
						vec: "<2,3,2,2,0,1>",
						z: null,
						complement: "7-8",
						inversion: null
					},
					{
						number: "5-z12",
						primeForm: '["0","1","3","5","6"]',
						vec: "<2,2,2,1,2,1>",
						z: "5-z36A",
						complement: "7-z12",
						inversion: null
					},
					{
						number: "5-15",
						primeForm: '["0","1","2","6","8"]',
						vec: "<2,2,0,2,2,2>",
						z: null,
						complement: "7-15",
						inversion: null
					},
					{
						number: "5-z17",
						primeForm: '["0","1","3","4","8"]',
						vec: "<2,1,2,3,2,0>",
						z: "5-z37",
						complement: "7-z17",
						inversion: null
					},
					{
						number: "5-22",
						primeForm: '["0","1","4","7","8"]',
						vec: "<2,0,2,3,2,1>",
						z: null,
						complement: "7-22",
						inversion: null
					},
					{
						number: "5-33",
						primeForm: '["0","2","4","6","8"]',
						vec: "<0,4,0,4,0,2>",
						z: null,
						complement: "7-33",
						inversion: null
					},
					{
						number: "5-34",
						primeForm: '["0","2","4","6","9"]',
						vec: "<0,3,2,2,2,1>",
						z: null,
						complement: "7-34",
						inversion: null
					},
					{
						number: "5-35",
						primeForm: '["0","2","4","7","9"]',
						vec: "<0,3,2,1,4,0>",
						z: null,
						complement: "7-35",
						inversion: null
					},
					{
						number: "5-z37",
						primeForm: '["0","3","4","5","8"]',
						vec: "<2,1,2,3,2,0>",
						z: "5-z17",
						complement: "7-z37",
						inversion: null
					},
					{
						number: "6-1",
						primeForm: '["0","1","2","3","4","5"]',
						vec: "<5,4,3,2,1,0>",
						z: null,
						complement: null,
						inversion: null
					},
					{
						number: "6-z4",
						primeForm: '["0","1","2","4","5","6"]',
						vec: "<4,3,2,3,2,1>",
						z: "6-z37",
						complement: "6-z37",
						inversion: null
					},
					{
						number: "6-z6",
						primeForm: '["0","1","2","5","6","7"]',
						vec: "<4,2,1,2,4,2>",
						z: "6-z38",
						complement: "6-z38",
						inversion: null
					},
					{
						number: "6-7",
						primeForm: '["0","1","2","6","7","8"]',
						vec: "<4,2,0,2,4,3>",
						z: null,
						complement: null,
						inversion: null
					},
					{
						number: "6-8",
						primeForm: '["0","2","3","4","5","7"]',
						vec: "<3,4,3,2,3,0>",
						z: null,
						complement: null,
						inversion: null
					},
					{
						number: "6-z13",
						primeForm: '["0","1","3","4","6","7"]',
						vec: "<3,2,4,2,2,2>",
						z: "6-z42",
						complement: "6-z42",
						inversion: null
					},
					{
						number: "6-20",
						primeForm: '["0","1","4","5","8","9"]',
						vec: "<3,0,3,6,3,0>",
						z: null,
						complement: null,
						inversion: null
					},
					{
						number: "6-z23",
						primeForm: '["0","2","3","5","6","8"]',
						vec: "<2,3,4,2,2,2>",
						z: "6-z45",
						complement: "6-z45",
						inversion: null
					},
					{
						number: "6-z26",
						primeForm: '["0","1","3","5","7","8"]',
						vec: "<2,3,2,3,4,1>",
						z: "6-z48",
						complement: "6-z48",
						inversion: null
					},
					{
						number: "6-z28",
						primeForm: '["0","1","3","5","6","9"]',
						vec: "<2,2,4,3,2,2>",
						z: "6-z49",
						complement: "6-z49",
						inversion: null
					},
					{
						number: "6-z29",
						primeForm: '["0","2","3","6","7","9"]',
						vec: "<2,2,4,2,3,2>",
						z: "6-z50",
						complement: "6-z50",
						inversion: null
					},
					{
						number: "6-32",
						primeForm: '["0","2","4","5","7","9"]',
						vec: "<1,4,3,2,5,0>",
						z: null,
						complement: null,
						inversion: null
					},
					{
						number: "6-35",
						primeForm: '["0","2","4","6","8","T"]',
						vec: "<0,6,0,6,0,3>",
						z: null,
						complement: null,
						inversion: null
					},
					{
						number: "6-z37",
						primeForm: '["0","1","2","3","4","8"]',
						vec: "<4,3,2,3,2,1>",
						z: "6-z4",
						complement: "6-z4",
						inversion: null
					},
					{
						number: "6-z38",
						primeForm: '["0","1","2","3","7","8"]',
						vec: "<4,2,1,2,4,2>",
						z: "6-z6",
						complement: "6-z6",
						inversion: null
					},
					{
						number: "6-z42",
						primeForm: '["0","1","2","3","6","9"]',
						vec: "<3,2,4,2,2,2>",
						z: "6-z13",
						complement: "6-z13",
						inversion: null
					},
					{
						number: "6-z45",
						primeForm: '["0","2","3","4","6","9"]',
						vec: "<2,3,4,2,2,2>",
						z: "6-z23",
						complement: "6-z23",
						inversion: null
					},
					{
						number: "6-z48",
						primeForm: '["0","1","2","5","7","9"]',
						vec: "<2,3,2,3,4,1>",
						z: "6-z26",
						complement: "6-z26",
						inversion: null
					},
					{
						number: "6-z49",
						primeForm: '["0","1","3","4","7","9"]',
						vec: "<2,2,4,3,2,2>",
						z: "6-z28",
						complement: "6-z28",
						inversion: null
					},
					{
						number: "6-z50",
						primeForm: '["0","1","4","6","7","9"]',
						vec: "<2,2,4,2,3,2>",
						z: "6-z29",
						complement: "6-z29",
						inversion: null
					},
					{
						number: "7-1",
						primeForm: '["0","1","2","3","4","5","6"]',
						vec: "<6,5,4,3,2,1>",
						z: null,
						complement: "5-1",
						inversion: null
					},
					{
						number: "7-8",
						primeForm: '["0","2","3","4","5","6","8"]',
						vec: "<4,5,4,4,2,2>",
						z: null,
						complement: "5-8",
						inversion: null
					},
					{
						number: "7-z12",
						primeForm: '["0","1","2","3","4","7","9"]',
						vec: "<4,4,4,3,4,2>",
						z: "7-z36A",
						complement: "5-z12",
						inversion: null
					},
					{
						number: "7-15",
						primeForm: '["0","1","2","4","6","7","8"]',
						vec: "<4,4,2,4,4,3>",
						z: null,
						complement: "5-15",
						inversion: null
					},
					{
						number: "7-z17",
						primeForm: '["0","1","2","4","5","6","9"]',
						vec: "<4,3,4,5,4,1>",
						z: "7-z37",
						complement: "5-z17",
						inversion: null
					},
					{
						number: "7-22",
						primeForm: '["0","1","2","5","6","8","9"]',
						vec: "<4,2,4,5,4,2>",
						z: null,
						complement: "5-22",
						inversion: null
					},
					{
						number: "7-33",
						primeForm: '["0","1","2","4","6","8","T"]',
						vec: "<2,6,2,6,2,3>",
						z: null,
						complement: "5-33",
						inversion: null
					},
					{
						number: "7-34",
						primeForm: '["0","1","3","4","6","8","T"]',
						vec: "<2,5,4,4,4,2>",
						z: null,
						complement: "5-34",
						inversion: null
					},
					{
						number: "7-35",
						primeForm: '["0","1","3","5","6","8","T"]',
						vec: "<2,5,4,3,6,1>",
						z: null,
						complement: "5-35",
						inversion: null
					},
					{
						number: "7-z37",
						primeForm: '["0","1","3","4","5","7","8"]',
						vec: "<4,3,4,5,4,1>",
						z: "7-z17",
						complement: "5-z37",
						inversion: null
					},
					{
						number: "8-1",
						primeForm: '["0","1","2","3","4","5","6","7"]',
						vec: "<7,6,5,4,4,2>",
						z: null,
						complement: "4-1",
						inversion: null
					},
					{
						number: "8-3",
						primeForm: '["0","1","2","3","4","5","6","9"]',
						vec: "<6,5,6,5,4,2>",
						z: null,
						complement: "4-3",
						inversion: null
					},
					{
						number: "8-6",
						primeForm: '["0","1","2","3","5","6","7","8"]',
						vec: "<6,5,4,4,6,3>",
						z: null,
						complement: "4-6",
						inversion: null
					},
					{
						number: "8-7",
						primeForm: '["0","1","2","3","4","5","8","9"]',
						vec: "<6,4,5,6,5,2>",
						z: null,
						complement: "4-7",
						inversion: null
					},
					{
						number: "8-8",
						primeForm: '["0","1","2","3","4","7","8","9"]',
						vec: "<6,4,4,5,6,3>",
						z: null,
						complement: "4-8",
						inversion: null
					},
					{
						number: "8-9",
						primeForm: '["0","1","2","3","6","7","8","9"]',
						vec: "<6,4,4,4,6,4>",
						z: null,
						complement: "4-9",
						inversion: null
					},
					{
						number: "8-10",
						primeForm: '["0","2","3","4","5","6","7","9"]',
						vec: "<5,6,6,4,5,2>",
						z: null,
						complement: "4-10",
						inversion: null
					},
					{
						number: "8-17",
						primeForm: '["0","1","3","4","5","6","8","9"]',
						vec: "<5,4,6,6,5,2>",
						z: null,
						complement: "4-17",
						inversion: null
					},
					{
						number: "8-20",
						primeForm: '["0","1","2","4","5","7","8","9"]',
						vec: "<5,4,5,6,6,2>",
						z: null,
						complement: "4-20",
						inversion: null
					},
					{
						number: "8-21",
						primeForm: '["0","1","2","3","4","6","8","T"]',
						vec: "<4,7,4,6,4,3>",
						z: null,
						complement: "4-21",
						inversion: null
					},
					{
						number: "8-23",
						primeForm: '["0","1","2","3","5","7","8","T"]',
						vec: "<4,6,5,4,7,2>",
						z: null,
						complement: "4-23",
						inversion: null
					},
					{
						number: "8-24",
						primeForm: '["0","1","2","4","5","6","8","T"]',
						vec: "<4,6,4,7,4,3>",
						z: null,
						complement: "4-24",
						inversion: null
					},
					{
						number: "8-25",
						primeForm: '["0","1","2","4","6","7","8","T"]',
						vec: "<4,6,4,6,4,4>",
						z: null,
						complement: "4-25",
						inversion: null
					},
					{
						number: "8-26",
						primeForm: '["0","1","3","4","5","7","8","T"]',
						vec: "<4,5,6,5,6,2>",
						z: null,
						complement: "4-26",
						inversion: null
					},
					{
						number: "8-28",
						primeForm: '["0","1","3","4","6","7","9","T"]',
						vec: "<4,4,8,4,4,4>",
						z: null,
						complement: "4-28",
						inversion: null
					},
					{
						number: "9-1",
						primeForm: '["0","1","2","3","4","5","6","7","8"]',
						vec: "<8,7,6,6,6,3>",
						z: null,
						complement: "3-1",
						inversion: null
					},
					{
						number: "9-6",
						primeForm: '["0","1","2","3","4","5","6","8","T"]',
						vec: "<6,8,6,7,6,3>",
						z: null,
						complement: "3-6",
						inversion: null
					},
					{
						number: "9-9",
						primeForm: '["0","1","2","3","5","6","7","8","T"]',
						vec: "<6,7,6,6,8,3>",
						z: null,
						complement: "3-9",
						inversion: null
					},
					{
						number: "9-10",
						primeForm: '["0","1","2","3","4","6","7","9","T"]',
						vec: "<6,6,8,6,6,4>",
						z: null,
						complement: "3-10",
						inversion: null
					},
					{
						number: "9-12",
						primeForm: '["0","1","2","4","5","6","8","9","T"]',
						vec: "<6,6,6,9,6,3>",
						z: null,
						complement: "3-12",
						inversion: null
					},
					{
						number: "10-1",
						primeForm: '["0","1","2","3","4","5","6","7","8","9"]',
						vec: "<9,8,8,8,8,4>",
						z: null,
						complement: "2-1",
						inversion: null
					},
					{
						number: "10-2",
						primeForm: '["0","1","2","3","4","5","6","7","8","T"]',
						vec: "<8,9,8,8,8,4>",
						z: null,
						complement: "2-2",
						inversion: null
					},
					{
						number: "10-3",
						primeForm: '["0","1","2","3","4","5","6","7","9","T"]',
						vec: "<8,8,9,8,8,4>",
						z: null,
						complement: "2-3",
						inversion: null
					},
					{
						number: "10-4",
						primeForm: '["0","1","2","3","4","5","6","8","9","T"]',
						vec: "<8,8,8,9,8,4>",
						z: null,
						complement: "2-4",
						inversion: null
					},
					{
						number: "10-5",
						primeForm: '["0","1","2","3","4","5","7","8","9","T"]',
						vec: "<8,8,8,8,9,4>",
						z: null,
						complement: "2-5",
						inversion: null
					},
					{
						number: "10-6",
						primeForm: '["0","1","2","3","4","6","7","8","9","T"]',
						vec: "<8,8,8,8,8,5>",
						z: null,
						complement: "2-6",
						inversion: null
					},
					{
						number: "11-1",
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T"]',
						vec: "<T,T,T,T,T,5>",
						z: null,
						complement: "1-1",
						inversion: null
					},
					{
						number: "12-1",
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T","E"]',
						vec: "<C,C,C,C,C,6>",
						z: null,
						complement: "0-1",
						inversion: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, not null and not variations", done => {
		chai
			.request(server)
			.get("/api/data/inversion/!null,!@1,!@4,!^6,!7$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "3-2A",
						primeForm: '["0","1","3"]',
						vec: "<1,1,1,0,0,0>",
						z: null,
						complement: "9-2A",
						inversion: '["0","2","3"]'
					},
					{
						number: "3-5A",
						primeForm: '["0","1","6"]',
						vec: "<1,0,0,0,1,1>",
						z: null,
						complement: "9-5B",
						inversion: '["0","5","6"]'
					},
					{
						number: "3-7A",
						primeForm: '["0","2","5"]',
						vec: "<0,1,1,0,1,0>",
						z: null,
						complement: "9-7B",
						inversion: '["0","3","5"]'
					},
					{
						number: "3-7B",
						primeForm: '["0","3","5"]',
						vec: "<0,1,1,0,1,0>",
						z: null,
						complement: "9-7A",
						inversion: '["0","2","5"]'
					},
					{
						number: "3-8B",
						primeForm: '["0","4","6"]',
						vec: "<0,1,0,1,0,1>",
						z: null,
						complement: "9-8A",
						inversion: '["0","2","6"]'
					},
					{
						number: "4-12B",
						primeForm: '["0","3","4","6"]',
						vec: "<1,1,2,1,0,1>",
						z: null,
						complement: "8-12B",
						inversion: '["0","2","3","6"]'
					},
					{
						number: "4-13A",
						primeForm: '["0","1","3","6"]',
						vec: "<1,1,2,0,1,1>",
						z: null,
						complement: "8-13B",
						inversion: '["0","3","5","6"]'
					},
					{
						number: "4-z15A",
						primeForm: '["0","1","4","6"]',
						vec: "<1,1,1,1,1,1>",
						z: "4-z29A",
						complement: "8-z15B",
						inversion: '["0","2","5","6"]'
					},
					{
						number: "4-27A",
						primeForm: '["0","2","5","8"]',
						vec: "<0,1,2,1,1,1>",
						z: null,
						complement: "8-27B",
						inversion: '["0","3","6","8"]'
					},
					{
						number: "4-27B",
						primeForm: '["0","3","6","8"]',
						vec: "<0,1,2,1,1,1>",
						z: null,
						complement: "8-27A",
						inversion: '["0","2","5","8"]'
					},
					{
						number: "5-10A",
						primeForm: '["0","1","3","4","6"]',
						vec: "<2,2,3,1,1,1>",
						z: null,
						complement: "7-10B",
						inversion: '["0","2","3","5","6"]'
					},
					{
						number: "5-20A",
						primeForm: '["0","1","5","6","8"]',
						vec: "<2,1,1,2,3,1>",
						z: null,
						complement: "7-20B",
						inversion: '["0","2","3","7","8"]'
					},
					{
						number: "5-25A",
						primeForm: '["0","2","3","5","8"]',
						vec: "<1,2,3,1,2,1>",
						z: null,
						complement: "7-25B",
						inversion: '["0","3","5","6","8"]'
					},
					{
						number: "5-25B",
						primeForm: '["0","3","5","6","8"]',
						vec: "<1,2,3,1,2,1>",
						z: null,
						complement: "7-25A",
						inversion: '["0","2","3","5","8"]'
					},
					{
						number: "5-27A",
						primeForm: '["0","1","3","5","8"]',
						vec: "<1,2,2,2,3,0>",
						z: null,
						complement: "7-27B",
						inversion: '["0","3","5","7","8"]'
					},
					{
						number: "5-28A",
						primeForm: '["0","2","3","6","8"]',
						vec: "<1,2,2,2,1,2>",
						z: null,
						complement: "7-28A",
						inversion: '["0","2","5","6","8"]'
					},
					{
						number: "5-28B",
						primeForm: '["0","2","5","6","8"]',
						vec: "<1,2,2,2,1,2>",
						z: null,
						complement: "7-28B",
						inversion: '["0","2","3","6","8"]'
					},
					{
						number: "5-29A",
						primeForm: '["0","1","3","6","8"]',
						vec: "<1,2,2,1,3,1>",
						z: null,
						complement: "7-29B",
						inversion: '["0","2","5","7","8"]'
					},
					{
						number: "5-31A",
						primeForm: '["0","1","3","6","9"]',
						vec: "<1,1,4,1,1,2>",
						z: null,
						complement: "7-31B",
						inversion: '["0","2","3","6","9"]'
					},
					{
						number: "5-32A",
						primeForm: '["0","1","4","6","9"]',
						vec: "<1,1,3,2,2,1>",
						z: null,
						complement: "7-32B",
						inversion: '["0","2","5","6","9"]'
					},
					{
						number: "5-z38A",
						primeForm: '["0","1","2","5","8"]',
						vec: "<2,1,2,2,2,1>",
						z: "5-z18A",
						complement: "7-z38B",
						inversion: '["0","3","6","7","8"]'
					},
					{
						number: "6-z25A",
						primeForm: '["0","1","3","5","6","8"]',
						vec: "<2,3,3,2,4,1>",
						z: "6-z47A",
						complement: "6-z47B",
						inversion: '["0","2","3","5","7","8"]'
					},
					{
						number: "6-27A",
						primeForm: '["0","1","3","4","6","9"]',
						vec: "<2,2,5,2,2,2>",
						z: null,
						complement: null,
						inversion: '["0","2","3","5","6","9"]'
					},
					{
						number: "6-30A",
						primeForm: '["0","1","3","6","7","9"]',
						vec: "<2,2,4,2,2,3>",
						z: null,
						complement: null,
						inversion: '["0","2","3","6","8","9"]'
					},
					{
						number: "6-33B",
						primeForm: '["0","2","4","6","7","9"]',
						vec: "<1,4,3,2,4,1>",
						z: null,
						complement: null,
						inversion: '["0","2","3","5","7","9"]'
					},
					{
						number: "6-z40A",
						primeForm: '["0","1","2","3","5","8"]',
						vec: "<3,3,3,2,3,1>",
						z: "6-z11A",
						complement: "6-z11B",
						inversion: '["0","3","5","6","7","8"]'
					},
					{
						number: "6-z41A",
						primeForm: '["0","1","2","3","6","8"]',
						vec: "<3,3,2,2,3,2>",
						z: "6-z12A",
						complement: "6-z12B",
						inversion: '["0","2","5","6","7","8"]'
					},
					{
						number: "6-z43A",
						primeForm: '["0","1","2","5","6","8"]',
						vec: "<3,2,2,3,3,2>",
						z: "6-z17A",
						complement: "6-z17B",
						inversion: '["0","2","3","6","7","8"]'
					},
					{
						number: "7-25A",
						primeForm: '["0","2","3","4","6","7","9"]',
						vec: "<3,4,5,3,4,2>",
						z: null,
						complement: "5-25B",
						inversion: '["0","2","3","5","6","7","9"]'
					},
					{
						number: "7-29A",
						primeForm: '["0","1","2","4","6","7","9"]',
						vec: "<3,4,4,3,5,2>",
						z: null,
						complement: "5-29B",
						inversion: '["0","2","3","5","7","8","9"]'
					},
					{
						number: "7-31A",
						primeForm: '["0","1","3","4","6","7","9"]',
						vec: "<3,3,6,3,3,3>",
						z: null,
						complement: "5-31B",
						inversion: '["0","2","3","5","6","8","9"]'
					},
					{
						number: "7-z36A",
						primeForm: '["0","1","2","3","5","6","8"]',
						vec: "<4,4,4,3,4,2>",
						z: "7-z12",
						complement: "5-z36B",
						inversion: '["0","2","3","5","6","7","8"]'
					},
					{
						number: "8-13A",
						primeForm: '["0","1","2","3","4","6","7","9"]',
						vec: "<5,5,6,4,5,3>",
						z: null,
						complement: "4-13B",
						inversion: '["0","2","3","5","6","7","8","9"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single exact", done => {
		chai
			.request(server)
			.get("/api/data/inversion/037")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "3-11B",
						primeForm: '["0","4","7"]',
						vec: "<0,0,1,1,1,0>",
						z: null,
						complement: "9-11A",
						inversion: '["0","3","7"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single starts with", done => {
		chai
			.request(server)
			.get("/api/data/inversion/^01245678")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "8-5A",
						primeForm: '["0","1","2","3","4","6","7","8"]',
						vec: "<6,5,4,5,5,3>",
						z: null,
						complement: "4-5B",
						inversion: '["0","1","2","4","5","6","7","8"]'
					},
					{
						number: "9-4A",
						primeForm: '["0","1","2","3","4","5","7","8","9"]',
						vec: "<7,6,6,7,7,3>",
						z: null,
						complement: "3-4B",
						inversion: '["0","1","2","4","5","6","7","8","9"]'
					},
					{
						number: "9-8A",
						primeForm: '["0","1","2","3","4","6","7","8","T"]',
						vec: "<6,7,6,7,6,4>",
						z: null,
						complement: "3-8B",
						inversion: '["0","1","2","4","5","6","7","8","T"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single ends with", done => {
		chai
			.request(server)
			.get("/api/data/inversion/26$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "3-8B",
						primeForm: '["0","4","6"]',
						vec: "<0,1,0,1,0,1>",
						z: null,
						complement: "9-8A",
						inversion: '["0","2","6"]'
					},
					{
						number: "4-5B",
						primeForm: '["0","4","5","6"]',
						vec: "<2,1,0,1,1,1>",
						z: null,
						complement: "8-5A",
						inversion: '["0","1","2","6"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});
});
