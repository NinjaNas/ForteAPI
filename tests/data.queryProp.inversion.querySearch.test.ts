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

describe("GET /api/data/:queryProp/inversion/:querySearch", () => {
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
			.get("/api/data/inversion/inversion/^00")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, $ query returns nothing", done => {
		chai
			.request(server)
			.get("/api/data/inversion/inversion/00$")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 200 and correct data, null, inversion", done => {
		chai
			.request(server)
			.get("/api/data/inversion/inversion/null")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					},
					{
						inversion: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, not null and not variations, vec+complement", done => {
		chai
			.request(server)
			.get("/api/data/inversion,vec/inversion/!null,!@1,!@4,!^6,!7$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						vec: "<1,1,1,0,0,0>",
						inversion: '["0","2","3"]'
					},
					{
						vec: "<1,0,0,0,1,1>",
						inversion: '["0","5","6"]'
					},
					{
						vec: "<0,1,1,0,1,0>",
						inversion: '["0","3","5"]'
					},
					{
						vec: "<0,1,1,0,1,0>",
						inversion: '["0","2","5"]'
					},
					{
						vec: "<0,1,0,1,0,1>",
						inversion: '["0","2","6"]'
					},
					{
						vec: "<1,1,2,1,0,1>",
						inversion: '["0","2","3","6"]'
					},
					{
						vec: "<1,1,2,0,1,1>",
						inversion: '["0","3","5","6"]'
					},
					{
						vec: "<1,1,1,1,1,1>",
						inversion: '["0","2","5","6"]'
					},
					{
						vec: "<0,1,2,1,1,1>",
						inversion: '["0","3","6","8"]'
					},
					{
						vec: "<0,1,2,1,1,1>",
						inversion: '["0","2","5","8"]'
					},
					{
						vec: "<2,2,3,1,1,1>",
						inversion: '["0","2","3","5","6"]'
					},
					{
						vec: "<2,1,1,2,3,1>",
						inversion: '["0","2","3","7","8"]'
					},
					{
						vec: "<1,2,3,1,2,1>",
						inversion: '["0","3","5","6","8"]'
					},
					{
						vec: "<1,2,3,1,2,1>",
						inversion: '["0","2","3","5","8"]'
					},
					{
						vec: "<1,2,2,2,3,0>",
						inversion: '["0","3","5","7","8"]'
					},
					{
						vec: "<1,2,2,2,1,2>",
						inversion: '["0","2","5","6","8"]'
					},
					{
						vec: "<1,2,2,2,1,2>",
						inversion: '["0","2","3","6","8"]'
					},
					{
						vec: "<1,2,2,1,3,1>",
						inversion: '["0","2","5","7","8"]'
					},
					{
						vec: "<1,1,4,1,1,2>",
						inversion: '["0","2","3","6","9"]'
					},
					{
						vec: "<1,1,3,2,2,1>",
						inversion: '["0","2","5","6","9"]'
					},
					{
						vec: "<2,1,2,2,2,1>",
						inversion: '["0","3","6","7","8"]'
					},
					{
						vec: "<2,3,3,2,4,1>",
						inversion: '["0","2","3","5","7","8"]'
					},
					{
						vec: "<2,2,5,2,2,2>",
						inversion: '["0","2","3","5","6","9"]'
					},
					{
						vec: "<2,2,4,2,2,3>",
						inversion: '["0","2","3","6","8","9"]'
					},
					{
						vec: "<1,4,3,2,4,1>",
						inversion: '["0","2","3","5","7","9"]'
					},
					{
						vec: "<3,3,3,2,3,1>",
						inversion: '["0","3","5","6","7","8"]'
					},
					{
						vec: "<3,3,2,2,3,2>",
						inversion: '["0","2","5","6","7","8"]'
					},
					{
						vec: "<3,2,2,3,3,2>",
						inversion: '["0","2","3","6","7","8"]'
					},
					{
						vec: "<3,4,5,3,4,2>",
						inversion: '["0","2","3","5","6","7","9"]'
					},
					{
						vec: "<3,4,4,3,5,2>",
						inversion: '["0","2","3","5","7","8","9"]'
					},
					{
						vec: "<3,3,6,3,3,3>",
						inversion: '["0","2","3","5","6","8","9"]'
					},
					{
						vec: "<4,4,4,3,4,2>",
						inversion: '["0","2","3","5","6","7","8"]'
					},
					{
						vec: "<5,5,6,4,5,3>",
						inversion: '["0","2","3","5","6","7","8","9"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single exact, number,primeForm,vec,z,complement,inversion", done => {
		chai
			.request(server)
			.get("/api/data/number,primeForm,vec,z,complement,inversion/inversion/037")
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
			.get("/api/data/inversion/inversion/^01245678")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						inversion: '["0","1","2","4","5","6","7","8"]'
					},
					{
						inversion: '["0","1","2","4","5","6","7","8","9"]'
					},
					{
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
			.get("/api/data/inversion/inversion/26$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						inversion: '["0","2","6"]'
					},
					{
						inversion: '["0","1","2","6"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});
});
