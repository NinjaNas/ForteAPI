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

describe("GET /api/data/:queryProp/number/:querySearch", () => {
	it("should return 414 if uri is over length", done => {
		chai
			.request(server)
			.get(
				"/api/data/number/number/0-1,1-1,2-1,2-2,2-3,2-4,2-5,2-6,3-2A,3-2B,3-3A,3-3B,3-4A,3-4B,3-5A,3-5B,3-6,3-7A,3-7B,3-8A,3-8B,3-11A"
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
			.get("/api/data/number/number/2-1~2-1")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, single range error multiple querys", done => {
		chai
			.request(server)
			.get("/api/data/number/number/2-1,2-1~2-1")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, error query not found", done => {
		chai
			.request(server)
			.get("/api/data/number/number/0-2")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, error invalid query", done => {
		chai
			.request(server)
			.get("/api/data/number/number/2312fafa1")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 200 and correct data, length stress test, number", done => {
		chai
			.request(server)
			.get(
				"/api/data/number/number/0-1,1-1,2-1,2-2,2-3,2-4,2-5,2-6,3-2A,3-2B,3-3A,3-3B,3-4A,3-4B,3-5A,3-5B,3-6,3-7A,3-7B,3-8A,3-8B,4-2A"
			)
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "0-1"
					},
					{
						number: "1-1"
					},
					{
						number: "2-1"
					},
					{
						number: "2-2"
					},
					{
						number: "2-3"
					},
					{
						number: "2-4"
					},
					{
						number: "2-5"
					},
					{
						number: "2-6"
					},
					{
						number: "3-2A"
					},
					{
						number: "3-2B"
					},
					{
						number: "3-3A"
					},
					{
						number: "3-3B"
					},
					{
						number: "3-4A"
					},
					{
						number: "3-4B"
					},
					{
						number: "3-5A"
					},
					{
						number: "3-5B"
					},
					{
						number: "3-6"
					},
					{
						number: "3-7A"
					},
					{
						number: "3-7B"
					},
					{
						number: "3-8A"
					},
					{
						number: "3-8B"
					},
					{
						number: "4-2A"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, most exclusion methods no duplicates, number+z", done => {
		chai
			.request(server)
			.get("/api/data/number,z/number/!0-1~8-7,!@8,!^9,!1$,`10-2~10-4")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "10-5",
						z: null
					},
					{
						number: "10-6",
						z: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, ! and `, primeForm", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/number/!0-1,`1-1")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						primeForm: '["0","1"]'
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

	it("should return 200 and correct data, no duplicates, inversion", done => {
		chai
			.request(server)
			.get("/api/data/inversion/number/2-1,2-1,2-1,2-1")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						inversion: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single exact, number+primeForm+vec+z+complement+inversion", done => {
		chai
			.request(server)
			.get("/api/data/number,primeForm,vec,z,complement,inversion/number/2-1")
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

	it("should return 200 and correct data, most exclusion methods using !` no duplicates, number", done => {
		chai
			.request(server)
			.get("/api/data/number/number/!0-1~8-7,!@8,!^9,!1$,!`10-2~10-4")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "10-5"
					},
					{
						number: "10-6"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, not range, complement", done => {
		chai
			.request(server)
			.get("/api/data/complement/number/!2-1~12-1")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						complement: "12-1"
					},
					{
						complement: "11-1"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, multi range, number", done => {
		chai
			.request(server)
			.get("/api/data/number/number/2-1~2-4")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "2-1"
					},
					{
						number: "2-2"
					},
					{
						number: "2-3"
					},
					{
						number: "2-4"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single starts with, number", done => {
		chai
			.request(server)
			.get("/api/data/number/number/^4-z")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "4-z15A"
					},
					{
						number: "4-z15B"
					},
					{
						number: "4-z29A"
					},
					{
						number: "4-z29B"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single ends with, number", done => {
		chai
			.request(server)
			.get("/api/data/number/number/-z50$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "6-z50"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});
});
