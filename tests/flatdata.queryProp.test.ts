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

describe("GET /api/flatdata/:prop", () => {
	it("should return the number dataset", done => {
		chai
			.request(server)
			.get("/api/flatdata/number")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(flatData.number);
				res.should.have.status(200);
				done();
			});
	});
	it("should return the primeForm dataset", done => {
		chai
			.request(server)
			.get("/api/flatdata/primeForm")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(flatData.primeForm);
				res.should.have.status(200);
				done();
			});
	});
	it("should return the vec dataset", done => {
		chai
			.request(server)
			.get("/api/flatdata/vec")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(flatData.vec);
				res.should.have.status(200);
				done();
			});
	});
	it("should return the z dataset", done => {
		chai
			.request(server)
			.get("/api/flatdata/z")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(flatData.z);
				res.should.have.status(200);
				done();
			});
	});
	it("should return the complement dataset", done => {
		chai
			.request(server)
			.get("/api/flatdata/complement")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(flatData.complement);
				res.should.have.status(200);
				done();
			});
	});
	it("should return the inversion dataset", done => {
		chai
			.request(server)
			.get("/api/flatdata/inversion")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(flatData.inversion);
				res.should.have.status(200);
				done();
			});
	});
});
