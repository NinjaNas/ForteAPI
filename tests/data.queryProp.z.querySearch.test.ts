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

describe("GET /api/data/:queryProp/z/:querySearch", () => {
	it("should return 414 if uri is over length", done => {
		chai
			.request(server)
			.get(
				"/api/data/z/z/00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
			)
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(414);
				done();
			});
	});

	it("should return 400, wrong format exact", done => {
		chai
			.request(server)
			.get("/api/data/z/z/adasdasd")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, ^ query returns nothing", done => {
		chai
			.request(server)
			.get("/api/data/z/z/^00")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, $ query returns nothing", done => {
		chai
			.request(server)
			.get("/api/data/z/z/00$")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 200 and correct data, null, z", done => {
		chai
			.request(server)
			.get("/api/data/z/z/null")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					},
					{
						z: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, not null and exclude variations, number+z", done => {
		chai
			.request(server)
			.get("/api/data/number,z/z/!null,`@A,`@4,`^6,`7$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "5-z36A",
						z: "5-z12"
					},
					{
						number: "5-z36B",
						z: "5-z12"
					},
					{
						number: "7-z36A",
						z: "7-z12"
					},
					{
						number: "7-z36B",
						z: "7-z12"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single starts with", done => {
		chai
			.request(server)
			.get("/api/data/number,primeForm,vec,z,complement,inversion/z/^4-z")
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

	it("should return 200 and correct data, single ends with, z", done => {
		chai
			.request(server)
			.get("/api/data/z/z/-z15A$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						z: "4-z15A"
					},
					{
						z: "4-z15A"
					},
					{
						z: "8-z15A"
					},
					{
						z: "8-z15A"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});
});
