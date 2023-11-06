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

describe("GET /api/data/:queryProp/primeForm/:querySearch", () => {
	it("should return 414 if uri is over length", done => {
		chai
			.request(server)
			.get(
				"/api/data/primeForm/primeForm/00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
			)
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(414);
				done();
			});
	});

	it("should return 400, wrong order exact", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/primeForm/10")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, wrong format", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/primeForm/[0,1,2,3,4]")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 200 and correct data, length stress test, primeForm", done => {
		chai
			.request(server)
			.get(
				"/api/data/primeForm/primeForm/0123456789TE,0123456789TE,0123456789TE,0123456789TE,0123456789TE,0123456789TE,0123456789TE,012345678"
			)
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T","E"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","8"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, empty space, vec", done => {
		chai
			.request(server)
			.get("/api/data/vec/primeForm/%20")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						vec: "<0,0,0,0,0,0>"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, contains, number+primeForm", done => {
		chai
			.request(server)
			.get("/api/data/number,primeForm/primeForm/@012345679")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "9-2A",
						primeForm: '["0","1","2","3","4","5","6","7","9"]'
					},
					{
						number: "10-1",
						primeForm: '["0","1","2","3","4","5","6","7","8","9"]'
					},
					{
						number: "10-3",
						primeForm: '["0","1","2","3","4","5","6","7","9","T"]'
					},
					{
						number: "11-1",
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T"]'
					},
					{
						number: "12-1",
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T","E"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, contains and out of order, number+primeForm+vec+z+complement+inversion", done => {
		chai
			.request(server)
			.get("/api/data/number,primeForm,vec,z,complement,inversion/primeForm/@021354679")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "9-2A",
						primeForm: '["0","1","2","3","4","5","6","7","9"]',
						vec: "<7,7,7,6,6,3>",
						z: null,
						complement: "3-2A",
						inversion: '["0","2","3","4","5","6","7","8","9"]'
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
						number: "10-3",
						primeForm: '["0","1","2","3","4","5","6","7","9","T"]',
						vec: "<8,8,9,8,8,4>",
						z: null,
						complement: "2-3",
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

	it("should return 200 and correct data, contains and repeats, primeForm", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/primeForm/@0123456799")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						primeForm: '["0","1","2","3","4","5","6","7","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T","E"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, not and not contains, primeForm", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/primeForm/! , !0, !@01, !@01234, !@012, !@02, !@8, !@7, !@6")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						primeForm: '["0","3"]'
					},
					{
						primeForm: '["0","4"]'
					},
					{
						primeForm: '["0","5"]'
					},
					{
						primeForm: '["0","3","4"]'
					},
					{
						primeForm: '["0","4","5"]'
					},
					{
						primeForm: '["0","3","5"]'
					},
					{
						primeForm: '["0","3","4","5"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, `, !^, and `$, primeForm", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/primeForm/`0-0,!^1,`1$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						primeForm: '[""]'
					},
					{
						primeForm: '["0"]'
					},
					{
						primeForm: '["0","2"]'
					},
					{
						primeForm: '["0","3"]'
					},
					{
						primeForm: '["0","4"]'
					},
					{
						primeForm: '["0","5"]'
					},
					{
						primeForm: '["0","6"]'
					},
					{
						primeForm: '["0","1","2"]'
					},
					{
						primeForm: '["0","1","3"]'
					},
					{
						primeForm: '["0","2","3"]'
					},
					{
						primeForm: '["0","1","4"]'
					},
					{
						primeForm: '["0","3","4"]'
					},
					{
						primeForm: '["0","1","5"]'
					},
					{
						primeForm: '["0","4","5"]'
					},
					{
						primeForm: '["0","1","6"]'
					},
					{
						primeForm: '["0","5","6"]'
					},
					{
						primeForm: '["0","2","4"]'
					},
					{
						primeForm: '["0","2","5"]'
					},
					{
						primeForm: '["0","3","5"]'
					},
					{
						primeForm: '["0","2","6"]'
					},
					{
						primeForm: '["0","4","6"]'
					},
					{
						primeForm: '["0","2","7"]'
					},
					{
						primeForm: '["0","3","6"]'
					},
					{
						primeForm: '["0","3","7"]'
					},
					{
						primeForm: '["0","4","7"]'
					},
					{
						primeForm: '["0","4","8"]'
					},
					{
						primeForm: '["0","1","2","3"]'
					},
					{
						primeForm: '["0","1","2","4"]'
					},
					{
						primeForm: '["0","2","3","4"]'
					},
					{
						primeForm: '["0","1","3","4"]'
					},
					{
						primeForm: '["0","1","2","5"]'
					},
					{
						primeForm: '["0","3","4","5"]'
					},
					{
						primeForm: '["0","1","2","6"]'
					},
					{
						primeForm: '["0","4","5","6"]'
					},
					{
						primeForm: '["0","1","2","7"]'
					},
					{
						primeForm: '["0","1","4","5"]'
					},
					{
						primeForm: '["0","1","5","6"]'
					},
					{
						primeForm: '["0","1","6","7"]'
					},
					{
						primeForm: '["0","2","3","5"]'
					},
					{
						primeForm: '["0","1","3","5"]'
					},
					{
						primeForm: '["0","2","4","5"]'
					},
					{
						primeForm: '["0","2","3","6"]'
					},
					{
						primeForm: '["0","3","4","6"]'
					},
					{
						primeForm: '["0","1","3","6"]'
					},
					{
						primeForm: '["0","3","5","6"]'
					},
					{
						primeForm: '["0","2","3","7"]'
					},
					{
						primeForm: '["0","4","5","7"]'
					},
					{
						primeForm: '["0","1","4","6"]'
					},
					{
						primeForm: '["0","2","5","6"]'
					},
					{
						primeForm: '["0","1","5","7"]'
					},
					{
						primeForm: '["0","2","6","7"]'
					},
					{
						primeForm: '["0","3","4","7"]'
					},
					{
						primeForm: '["0","1","4","7"]'
					},
					{
						primeForm: '["0","3","6","7"]'
					},
					{
						primeForm: '["0","1","4","8"]'
					},
					{
						primeForm: '["0","3","4","8"]'
					},
					{
						primeForm: '["0","1","5","8"]'
					},
					{
						primeForm: '["0","2","4","6"]'
					},
					{
						primeForm: '["0","2","4","7"]'
					},
					{
						primeForm: '["0","3","5","7"]'
					},
					{
						primeForm: '["0","2","5","7"]'
					},
					{
						primeForm: '["0","2","4","8"]'
					},
					{
						primeForm: '["0","2","6","8"]'
					},
					{
						primeForm: '["0","3","5","8"]'
					},
					{
						primeForm: '["0","2","5","8"]'
					},
					{
						primeForm: '["0","3","6","8"]'
					},
					{
						primeForm: '["0","3","6","9"]'
					},
					{
						primeForm: '["0","1","3","7"]'
					},
					{
						primeForm: '["0","4","6","7"]'
					},
					{
						primeForm: '["0","1","2","3","4"]'
					},
					{
						primeForm: '["0","1","2","3","5"]'
					},
					{
						primeForm: '["0","2","3","4","5"]'
					},
					{
						primeForm: '["0","1","2","4","5"]'
					},
					{
						primeForm: '["0","1","3","4","5"]'
					},
					{
						primeForm: '["0","1","2","3","6"]'
					},
					{
						primeForm: '["0","3","4","5","6"]'
					},
					{
						primeForm: '["0","1","2","3","7"]'
					},
					{
						primeForm: '["0","4","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","5","6"]'
					},
					{
						primeForm: '["0","1","4","5","6"]'
					},
					{
						primeForm: '["0","1","2","6","7"]'
					},
					{
						primeForm: '["0","1","5","6","7"]'
					},
					{
						primeForm: '["0","2","3","4","6"]'
					},
					{
						primeForm: '["0","1","2","4","6"]'
					},
					{
						primeForm: '["0","2","4","5","6"]'
					},
					{
						primeForm: '["0","1","3","4","6"]'
					},
					{
						primeForm: '["0","2","3","5","6"]'
					},
					{
						primeForm: '["0","2","3","4","7"]'
					},
					{
						primeForm: '["0","3","4","5","7"]'
					},
					{
						primeForm: '["0","1","3","5","6"]'
					},
					{
						primeForm: '["0","1","2","4","8"]'
					},
					{
						primeForm: '["0","2","3","4","8"]'
					},
					{
						primeForm: '["0","1","2","5","7"]'
					},
					{
						primeForm: '["0","2","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","6","8"]'
					},
					{
						primeForm: '["0","1","3","4","7"]'
					},
					{
						primeForm: '["0","3","4","6","7"]'
					},
					{
						primeForm: '["0","1","3","4","8"]'
					},
					{
						primeForm: '["0","1","4","5","7"]'
					},
					{
						primeForm: '["0","2","3","6","7"]'
					},
					{
						primeForm: '["0","1","3","6","7"]'
					},
					{
						primeForm: '["0","1","4","6","7"]'
					},
					{
						primeForm: '["0","1","5","6","8"]'
					},
					{
						primeForm: '["0","2","3","7","8"]'
					},
					{
						primeForm: '["0","1","4","5","8"]'
					},
					{
						primeForm: '["0","3","4","7","8"]'
					},
					{
						primeForm: '["0","1","4","7","8"]'
					},
					{
						primeForm: '["0","2","3","5","7"]'
					},
					{
						primeForm: '["0","2","4","5","7"]'
					},
					{
						primeForm: '["0","1","3","5","7"]'
					},
					{
						primeForm: '["0","2","4","6","7"]'
					},
					{
						primeForm: '["0","2","3","5","8"]'
					},
					{
						primeForm: '["0","3","5","6","8"]'
					},
					{
						primeForm: '["0","2","4","5","8"]'
					},
					{
						primeForm: '["0","3","4","6","8"]'
					},
					{
						primeForm: '["0","1","3","5","8"]'
					},
					{
						primeForm: '["0","3","5","7","8"]'
					},
					{
						primeForm: '["0","2","3","6","8"]'
					},
					{
						primeForm: '["0","2","5","6","8"]'
					},
					{
						primeForm: '["0","1","3","6","8"]'
					},
					{
						primeForm: '["0","2","5","7","8"]'
					},
					{
						primeForm: '["0","1","4","6","8"]'
					},
					{
						primeForm: '["0","2","4","7","8"]'
					},
					{
						primeForm: '["0","1","3","6","9"]'
					},
					{
						primeForm: '["0","2","3","6","9"]'
					},
					{
						primeForm: '["0","1","4","6","9"]'
					},
					{
						primeForm: '["0","2","5","6","9"]'
					},
					{
						primeForm: '["0","2","4","6","8"]'
					},
					{
						primeForm: '["0","2","4","6","9"]'
					},
					{
						primeForm: '["0","2","4","7","9"]'
					},
					{
						primeForm: '["0","1","2","4","7"]'
					},
					{
						primeForm: '["0","3","5","6","7"]'
					},
					{
						primeForm: '["0","3","4","5","8"]'
					},
					{
						primeForm: '["0","1","2","5","8"]'
					},
					{
						primeForm: '["0","3","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","5"]'
					},
					{
						primeForm: '["0","1","2","3","4","6"]'
					},
					{
						primeForm: '["0","2","3","4","5","6"]'
					},
					{
						primeForm: '["0","1","2","3","5","6"]'
					},
					{
						primeForm: '["0","1","3","4","5","6"]'
					},
					{
						primeForm: '["0","1","2","4","5","6"]'
					},
					{
						primeForm: '["0","1","2","3","6","7"]'
					},
					{
						primeForm: '["0","1","4","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","6","7","8"]'
					},
					{
						primeForm: '["0","2","3","4","5","7"]'
					},
					{
						primeForm: '["0","1","2","3","5","7"]'
					},
					{
						primeForm: '["0","2","4","5","6","7"]'
					},
					{
						primeForm: '["0","1","3","4","5","7"]'
					},
					{
						primeForm: '["0","2","3","4","6","7"]'
					},
					{
						primeForm: '["0","1","2","4","5","7"]'
					},
					{
						primeForm: '["0","2","3","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","4","6","7"]'
					},
					{
						primeForm: '["0","1","3","5","6","7"]'
					},
					{
						primeForm: '["0","1","3","4","6","7"]'
					},
					{
						primeForm: '["0","1","3","4","5","8"]'
					},
					{
						primeForm: '["0","3","4","5","7","8"]'
					},
					{
						primeForm: '["0","1","2","4","5","8"]'
					},
					{
						primeForm: '["0","3","4","6","7","8"]'
					},
					{
						primeForm: '["0","1","4","5","6","8"]'
					},
					{
						primeForm: '["0","2","3","4","7","8"]'
					},
					{
						primeForm: '["0","1","2","4","7","8"]'
					},
					{
						primeForm: '["0","1","4","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","5","7","8"]'
					},
					{
						primeForm: '["0","1","3","6","7","8"]'
					},
					{
						primeForm: '["0","1","3","4","7","8"]'
					},
					{
						primeForm: '["0","1","4","5","7","8"]'
					},
					{
						primeForm: '["0","1","4","5","8","9"]'
					},
					{
						primeForm: '["0","2","3","4","6","8"]'
					},
					{
						primeForm: '["0","2","4","5","6","8"]'
					},
					{
						primeForm: '["0","1","2","4","6","8"]'
					},
					{
						primeForm: '["0","2","4","6","7","8"]'
					},
					{
						primeForm: '["0","2","3","5","6","8"]'
					},
					{
						primeForm: '["0","1","3","4","6","8"]'
					},
					{
						primeForm: '["0","2","4","5","7","8"]'
					},
					{
						primeForm: '["0","1","3","5","6","8"]'
					},
					{
						primeForm: '["0","2","3","5","7","8"]'
					},
					{
						primeForm: '["0","1","3","5","7","8"]'
					},
					{
						primeForm: '["0","1","3","4","6","9"]'
					},
					{
						primeForm: '["0","2","3","5","6","9"]'
					},
					{
						primeForm: '["0","1","3","5","6","9"]'
					},
					{
						primeForm: '["0","2","3","6","7","9"]'
					},
					{
						primeForm: '["0","1","3","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","6","8","9"]'
					},
					{
						primeForm: '["0","1","4","5","7","9"]'
					},
					{
						primeForm: '["0","2","4","5","8","9"]'
					},
					{
						primeForm: '["0","2","4","5","7","9"]'
					},
					{
						primeForm: '["0","2","3","5","7","9"]'
					},
					{
						primeForm: '["0","2","4","6","7","9"]'
					},
					{
						primeForm: '["0","1","3","5","7","9"]'
					},
					{
						primeForm: '["0","2","4","6","8","9"]'
					},
					{
						primeForm: '["0","2","4","6","8","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","7"]'
					},
					{
						primeForm: '["0","3","4","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","3","4","8"]'
					},
					{
						primeForm: '["0","1","2","3","7","8"]'
					},
					{
						primeForm: '["0","2","3","4","5","8"]'
					},
					{
						primeForm: '["0","3","4","5","6","8"]'
					},
					{
						primeForm: '["0","1","2","3","5","8"]'
					},
					{
						primeForm: '["0","3","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","6","8"]'
					},
					{
						primeForm: '["0","2","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","6","9"]'
					},
					{
						primeForm: '["0","1","2","5","6","8"]'
					},
					{
						primeForm: '["0","2","3","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","5","6","9"]'
					},
					{
						primeForm: '["0","1","4","5","6","9"]'
					},
					{
						primeForm: '["0","2","3","4","6","9"]'
					},
					{
						primeForm: '["0","1","2","4","6","9"]'
					},
					{
						primeForm: '["0","2","4","5","6","9"]'
					},
					{
						primeForm: '["0","1","2","4","7","9"]'
					},
					{
						primeForm: '["0","2","3","4","7","9"]'
					},
					{
						primeForm: '["0","1","2","5","7","9"]'
					},
					{
						primeForm: '["0","1","3","4","7","9"]'
					},
					{
						primeForm: '["0","1","4","6","7","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","7"]'
					},
					{
						primeForm: '["0","2","3","4","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","8"]'
					},
					{
						primeForm: '["0","3","4","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","7"]'
					},
					{
						primeForm: '["0","1","3","4","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","3","4","7","8"]'
					},
					{
						primeForm: '["0","1","4","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","5","6","7","8"]'
					},
					{
						primeForm: '["0","2","3","4","5","6","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","8"]'
					},
					{
						primeForm: '["0","2","4","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","9"]'
					},
					{
						primeForm: '["0","2","3","4","5","6","9"]'
					},
					{
						primeForm: '["0","1","3","4","5","6","8"]'
					},
					{
						primeForm: '["0","2","3","4","5","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","7","9"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","8"]'
					},
					{
						primeForm: '["0","2","3","4","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","5","7","8"]'
					},
					{
						primeForm: '["0","1","3","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","4","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","9"]'
					},
					{
						primeForm: '["0","1","3","4","5","6","9"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","9"]'
					},
					{
						primeForm: '["0","1","4","5","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","4","5","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","6","7","9"]'
					},
					{
						primeForm: '["0","1","2","3","6","8","9"]'
					},
					{
						primeForm: '["0","1","2","5","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","4","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","5","8","9"]'
					},
					{
						primeForm: '["0","1","3","4","5","8","9"]'
					},
					{
						primeForm: '["0","1","2","5","6","8","9"]'
					},
					{
						primeForm: '["0","2","3","4","5","7","9"]'
					},
					{
						primeForm: '["0","2","4","5","6","7","9"]'
					},
					{
						primeForm: '["0","1","2","3","5","7","9"]'
					},
					{
						primeForm: '["0","2","4","6","7","8","9"]'
					},
					{
						primeForm: '["0","2","3","4","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","5","6","7","9"]'
					},
					{
						primeForm: '["0","1","3","4","5","7","9"]'
					},
					{
						primeForm: '["0","2","4","5","6","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","5","7","9"]'
					},
					{
						primeForm: '["0","2","4","5","7","8","9"]'
					},
					{
						primeForm: '["0","1","3","5","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","4","6","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","5","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","6","8","9"]'
					},
					{
						primeForm: '["0","1","3","5","7","8","9"]'
					},
					{
						primeForm: '["0","1","3","4","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","5","6","8","9"]'
					},
					{
						primeForm: '["0","1","3","4","6","8","9"]'
					},
					{
						primeForm: '["0","1","3","5","6","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","6","8","T"]'
					},
					{
						primeForm: '["0","1","3","4","6","8","T"]'
					},
					{
						primeForm: '["0","1","3","5","6","8","T"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","8"]'
					},
					{
						primeForm: '["0","2","3","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","3","4","5","7","8"]'
					},
					{
						primeForm: '["0","1","2","4","5","7","8"]'
					},
					{
						primeForm: '["0","1","3","4","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","8"]'
					},
					{
						primeForm: '["0","2","3","4","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","7","8"]'
					},
					{
						primeForm: '["0","1","3","4","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","6","7","8","9"]'
					},
					{
						primeForm: '["0","2","3","4","5","6","7","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","7","9"]'
					},
					{
						primeForm: '["0","2","4","5","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","3","4","5","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","4","5","6","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","5","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","4","5","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","8","9"]'
					},
					{
						primeForm: '["0","1","3","5","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","5","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","3","4","5","6","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","8","9"]'
					},
					{
						primeForm: '["0","1","3","4","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","8","9"]'
					},
					{
						primeForm: '["0","1","3","4","5","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","5","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","8","T"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","8","T"]'
					},
					{
						primeForm: '["0","1","3","4","5","6","8","T"]'
					},
					{
						primeForm: '["0","1","2","3","5","7","8","T"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","8","T"]'
					},
					{
						primeForm: '["0","1","2","4","6","7","8","T"]'
					},
					{
						primeForm: '["0","1","3","4","5","7","8","T"]'
					},
					{
						primeForm: '["0","1","2","4","5","7","8","T"]'
					},
					{
						primeForm: '["0","1","3","4","6","7","8","T"]'
					},
					{
						primeForm: '["0","1","3","4","6","7","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","4","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","8"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","9"]'
					},
					{
						primeForm: '["0","2","3","4","5","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","8","9"]'
					},
					{
						primeForm: '["0","1","3","4","5","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","8","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","7","8","T"]'
					},
					{
						primeForm: '["0","1","3","4","5","6","7","8","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","7","8","T"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","7","8","T"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","7","8","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","7","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","5","6","7","9","T"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","7","9","T"]'
					},
					{
						primeForm: '["0","1","2","4","5","6","8","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","8","9"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","8","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","8","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","7","8","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","6","7","8","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T"]'
					},
					{
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T","E"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});
});
