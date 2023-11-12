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

readFiles();

describe("GET /api/data/vec/:querySearch", () => {
	it("should return 414 if uri is over length", done => {
		chai
			.request(server)
			.get(
				"/api/data/vec/00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
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
			.get("/api/data/vec/<1,1,1,1,1,1>")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, wrong length under", done => {
		chai
			.request(server)
			.get("/api/data/vec/11111")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, wrong length over", done => {
		chai
			.request(server)
			.get("/api/data/vec/1111111")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, wrong format lowercase x ", done => {
		chai
			.request(server)
			.get("/api/data/vec/11x1x1")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, wrong length under", done => {
		chai
			.request(server)
			.get("/api/data/vec/11111")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 200 and correct data, length stress test", done => {
		chai
			.request(server)
			.get("/api/data/vec/111111")
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

	it("should return 200 and correct data, wildcard search", done => {
		chai
			.request(server)
			.get("/api/data/vec/11X1X1")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "4-12A",
						primeForm: '["0","2","3","6"]',
						vec: "<1,1,2,1,0,1>",
						z: null,
						complement: "8-12A",
						inversion: '["0","3","4","6"]'
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
						number: "4-16A",
						primeForm: '["0","1","5","7"]',
						vec: "<1,1,0,1,2,1>",
						z: null,
						complement: "8-16B",
						inversion: '["0","2","6","7"]'
					},
					{
						number: "4-16B",
						primeForm: '["0","2","6","7"]',
						vec: "<1,1,0,1,2,1>",
						z: null,
						complement: "8-16A",
						inversion: '["0","1","5","7"]'
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

	it("should return 200 and correct data, ^, $, `@, `^, `0$", done => {
		chai
			.request(server)
			.get("/api/data/vec/^1,1$,`@4,`^2,`0$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
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
						number: "4-12A",
						primeForm: '["0","2","3","6"]',
						vec: "<1,1,2,1,0,1>",
						z: null,
						complement: "8-12A",
						inversion: '["0","3","4","6"]'
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
						number: "4-13B",
						primeForm: '["0","3","5","6"]',
						vec: "<1,1,2,0,1,1>",
						z: null,
						complement: "8-13A",
						inversion: '["0","1","3","6"]'
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
						number: "4-z15B",
						primeForm: '["0","2","5","6"]',
						vec: "<1,1,1,1,1,1>",
						z: "4-z29A",
						complement: "8-z15A",
						inversion: '["0","1","4","6"]'
					},
					{
						number: "4-16A",
						primeForm: '["0","1","5","7"]',
						vec: "<1,1,0,1,2,1>",
						z: null,
						complement: "8-16B",
						inversion: '["0","2","6","7"]'
					},
					{
						number: "4-16B",
						primeForm: '["0","2","6","7"]',
						vec: "<1,1,0,1,2,1>",
						z: null,
						complement: "8-16A",
						inversion: '["0","1","5","7"]'
					},
					{
						number: "4-18A",
						primeForm: '["0","1","4","7"]',
						vec: "<1,0,2,1,1,1>",
						z: null,
						complement: "8-18B",
						inversion: '["0","3","6","7"]'
					},
					{
						number: "4-18B",
						primeForm: '["0","3","6","7"]',
						vec: "<1,0,2,1,1,1>",
						z: null,
						complement: "8-18A",
						inversion: '["0","1","4","7"]'
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
					},
					{
						number: "5-24A",
						primeForm: '["0","1","3","5","7"]',
						vec: "<1,3,1,2,2,1>",
						z: null,
						complement: "7-24B",
						inversion: '["0","2","4","6","7"]'
					},
					{
						number: "5-24B",
						primeForm: '["0","2","4","6","7"]',
						vec: "<1,3,1,2,2,1>",
						z: null,
						complement: "7-24A",
						inversion: '["0","1","3","5","7"]'
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
						number: "5-26A",
						primeForm: '["0","2","4","5","8"]',
						vec: "<1,2,2,3,1,1>",
						z: null,
						complement: "7-26A",
						inversion: '["0","3","4","6","8"]'
					},
					{
						number: "5-26B",
						primeForm: '["0","3","4","6","8"]',
						vec: "<1,2,2,3,1,1>",
						z: null,
						complement: "7-26B",
						inversion: '["0","2","4","5","8"]'
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
						number: "5-29B",
						primeForm: '["0","2","5","7","8"]',
						vec: "<1,2,2,1,3,1>",
						z: null,
						complement: "7-29A",
						inversion: '["0","1","3","6","8"]'
					},
					{
						number: "5-30A",
						primeForm: '["0","1","4","6","8"]',
						vec: "<1,2,1,3,2,1>",
						z: null,
						complement: "7-30B",
						inversion: '["0","2","4","7","8"]'
					},
					{
						number: "5-30B",
						primeForm: '["0","2","4","7","8"]',
						vec: "<1,2,1,3,2,1>",
						z: null,
						complement: "7-30A",
						inversion: '["0","1","4","6","8"]'
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
						number: "5-32B",
						primeForm: '["0","2","5","6","9"]',
						vec: "<1,1,3,2,2,1>",
						z: null,
						complement: "7-32A",
						inversion: '["0","1","4","6","9"]'
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
						number: "3-10",
						primeForm: '["0","3","6"]',
						vec: "<0,0,2,0,0,1>",
						z: null,
						complement: "9-10",
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
						number: "4-24",
						primeForm: '["0","2","4","8"]',
						vec: "<0,2,0,3,0,1>",
						z: null,
						complement: "8-24",
						inversion: null
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
						number: "5-4A",
						primeForm: '["0","1","2","3","6"]',
						vec: "<3,2,2,1,1,1>",
						z: null,
						complement: "7-4B",
						inversion: '["0","3","4","5","6"]'
					},
					{
						number: "5-4B",
						primeForm: '["0","3","4","5","6"]',
						vec: "<3,2,2,1,1,1>",
						z: null,
						complement: "7-4A",
						inversion: '["0","1","2","3","6"]'
					},
					{
						number: "5-5A",
						primeForm: '["0","1","2","3","7"]',
						vec: "<3,2,1,1,2,1>",
						z: null,
						complement: "7-5B",
						inversion: '["0","4","5","6","7"]'
					},
					{
						number: "5-5B",
						primeForm: '["0","4","5","6","7"]',
						vec: "<3,2,1,1,2,1>",
						z: null,
						complement: "7-5A",
						inversion: '["0","1","2","3","7"]'
					},
					{
						number: "5-6A",
						primeForm: '["0","1","2","5","6"]',
						vec: "<3,1,1,2,2,1>",
						z: null,
						complement: "7-6B",
						inversion: '["0","1","4","5","6"]'
					},
					{
						number: "5-6B",
						primeForm: '["0","1","4","5","6"]',
						vec: "<3,1,1,2,2,1>",
						z: null,
						complement: "7-6A",
						inversion: '["0","1","2","5","6"]'
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
						number: "6-z10A",
						primeForm: '["0","1","3","4","5","7"]',
						vec: "<3,3,3,3,2,1>",
						z: "6-z39A",
						complement: "6-z39B",
						inversion: '["0","2","3","4","6","7"]'
					},
					{
						number: "6-z10B",
						primeForm: '["0","2","3","4","6","7"]',
						vec: "<3,3,3,3,2,1>",
						z: "6-z39A",
						complement: "6-z39A",
						inversion: '["0","1","3","4","5","7"]'
					},
					{
						number: "6-z11A",
						primeForm: '["0","1","2","4","5","7"]',
						vec: "<3,3,3,2,3,1>",
						z: "6-z40A",
						complement: "6-z40B",
						inversion: '["0","2","3","5","6","7"]'
					},
					{
						number: "6-z11B",
						primeForm: '["0","2","3","5","6","7"]',
						vec: "<3,3,3,2,3,1>",
						z: "6-z40A",
						complement: "6-z40A",
						inversion: '["0","1","2","4","5","7"]'
					},
					{
						number: "6-z39A",
						primeForm: '["0","2","3","4","5","8"]',
						vec: "<3,3,3,3,2,1>",
						z: "6-z10A",
						complement: "6-z10B",
						inversion: '["0","3","4","5","6","8"]'
					},
					{
						number: "6-z39B",
						primeForm: '["0","3","4","5","6","8"]',
						vec: "<3,3,3,3,2,1>",
						z: "6-z10A",
						complement: "6-z10A",
						inversion: '["0","2","3","4","5","8"]'
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
						number: "6-z40B",
						primeForm: '["0","3","5","6","7","8"]',
						vec: "<3,3,3,2,3,1>",
						z: "6-z11A",
						complement: "6-z11A",
						inversion: '["0","1","2","3","5","8"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});
});
