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

describe("GET /api/data/number/:querySearch", () => {
	it("should return 414 if uri is over length", done => {
		chai
			.request(server)
			.get(
				"/api/data/number/0-1,1-1,2-1,2-2,2-3,2-4,2-5,2-6,3-2A,3-2B,3-3A,3-3B,3-4A,3-4B,3-5A,3-5B,3-6,3-7A,3-7B,3-8A,3-8B,3-11A"
			)
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(414);
				done();
			});
	});

	it("should return 400, single range error", done => {
		chai
			.request(server)
			.get("/api/data/number/2-1~2-1")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, single range error multiple querys", done => {
		chai
			.request(server)
			.get("/api/data/number/2-1,2-1~2-1")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, error query not found", done => {
		chai
			.request(server)
			.get("/api/data/number/0-2")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, error invalid query", done => {
		chai
			.request(server)
			.get("/api/data/number/2312fafa1")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 200 and correct data, length stress test", done => {
		chai
			.request(server)
			.get(
				"/api/data/number/0-1,1-1,2-1,2-2,2-3,2-4,2-5,2-6,3-2A,3-2B,3-3A,3-3B,3-4A,3-4B,3-5A,3-5B,3-6,3-7A,3-7B,3-8A,3-8B,4-2A"
			)
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
						number: "3-2A",
						primeForm: '["0","1","3"]',
						vec: "<1,1,1,0,0,0>",
						z: null,
						complement: "9-2A",
						inversion: '["0","2","3"]'
					},
					{
						number: "3-2B",
						primeForm: '["0","2","3"]',
						vec: "<1,1,1,0,0,0>",
						z: null,
						complement: "9-2B",
						inversion: '["0","1","3"]'
					},
					{
						number: "3-3A",
						primeForm: '["0","1","4"]',
						vec: "<1,0,1,1,0,0>",
						z: null,
						complement: "9-3B",
						inversion: '["0","3","4"]'
					},
					{
						number: "3-3B",
						primeForm: '["0","3","4"]',
						vec: "<1,0,1,1,0,0>",
						z: null,
						complement: "9-3A",
						inversion: '["0","1","4"]'
					},
					{
						number: "3-4A",
						primeForm: '["0","1","5"]',
						vec: "<1,0,0,1,1,0>",
						z: null,
						complement: "9-4B",
						inversion: '["0","4","5"]'
					},
					{
						number: "3-4B",
						primeForm: '["0","4","5"]',
						vec: "<1,0,0,1,1,0>",
						z: null,
						complement: "9-4A",
						inversion: '["0","1","5"]'
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
						number: "3-5B",
						primeForm: '["0","5","6"]',
						vec: "<1,0,0,0,1,1>",
						z: null,
						complement: "9-5A",
						inversion: '["0","1","6"]'
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
						number: "3-8A",
						primeForm: '["0","2","6"]',
						vec: "<0,1,0,1,0,1>",
						z: null,
						complement: "9-8B",
						inversion: '["0","4","6"]'
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
						number: "4-2A",
						primeForm: '["0","1","2","4"]',
						vec: "<2,2,1,1,0,0>",
						z: null,
						complement: "8-2B",
						inversion: '["0","2","3","4"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, all methods no duplicates", done => {
		chai
			.request(server)
			.get("/api/data/number/2-1,2-1~2-2,^3-3,-z50$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
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
						number: "3-3A",
						primeForm: '["0","1","4"]',
						vec: "<1,0,1,1,0,0>",
						z: null,
						complement: "9-3B",
						inversion: '["0","3","4"]'
					},
					{
						number: "3-3B",
						primeForm: '["0","3","4"]',
						vec: "<1,0,1,1,0,0>",
						z: null,
						complement: "9-3A",
						inversion: '["0","1","4"]'
					},
					{
						number: "6-z50",
						primeForm: '["0","1","4","6","7","9"]',
						vec: "<2,2,4,2,3,2>",
						z: "6-z29",
						complement: "6-z29",
						inversion: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, no duplicates", done => {
		chai
			.request(server)
			.get("/api/data/number/2-1,2-1,2-1,2-1")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "2-1",
						primeForm: '["0","1"]',
						vec: "<1,0,0,0,0,0>",
						z: null,
						complement: "10-1",
						inversion: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single exact", done => {
		chai
			.request(server)
			.get("/api/data/number/2-1")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "2-1",
						primeForm: '["0","1"]',
						vec: "<1,0,0,0,0,0>",
						z: null,
						complement: "10-1",
						inversion: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, not range", done => {
		chai
			.request(server)
			.get("/api/data/number/!2-1~12-1")
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
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, multi range", done => {
		chai
			.request(server)
			.get("/api/data/number/2-1~2-4")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
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
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single starts with", done => {
		chai
			.request(server)
			.get("/api/data/number/^4-z")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "4-z15A",
						primeForm: '["0","1","4","6"]',
						vec: "<1,1,1,1,1,1>",
						z: "4-z29A",
						complement: "8-z15B",
						inversion: '["0","2","5","6"]'
					},
					{
						number: "4-z15B",
						primeForm: '["0","2","5","6"]',
						vec: "<1,1,1,1,1,1>",
						z: "4-z29A",
						complement: "8-z15A",
						inversion: '["0","1","4","6"]'
					},
					{
						number: "4-z29A",
						primeForm: '["0","1","3","7"]',
						vec: "<1,1,1,1,1,1>",
						z: "4-z15A",
						complement: "8-z29B",
						inversion: '["0","4","6","7"]'
					},
					{
						number: "4-z29B",
						primeForm: '["0","4","6","7"]',
						vec: "<1,1,1,1,1,1>",
						z: "4-z15A",
						complement: "8-z29A",
						inversion: '["0","1","3","7"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single ends with", done => {
		chai
			.request(server)
			.get("/api/data/number/-z50$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "6-z50",
						primeForm: '["0","1","4","6","7","9"]',
						vec: "<2,2,4,2,3,2>",
						z: "6-z29",
						complement: "6-z29",
						inversion: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});
});
