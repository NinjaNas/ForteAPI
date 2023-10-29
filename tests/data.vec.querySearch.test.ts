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

describe("GET /api/vec/:querySearch", () => {
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
});
