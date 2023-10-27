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

describe("GET /api/data/primeForm/:querySearch", () => {
	it("should return 414 if uri is over length", done => {
		chai
			.request(server)
			.get(
				"/api/data/primeForm/00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
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
			.get("/api/data/primeForm/10")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, wrong format", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/[0,1,2,3,4]")
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
				"/api/data/primeForm/0123456789TE,0123456789TE,0123456789TE,0123456789TE,0123456789TE,0123456789TE,0123456789TE,012345678"
			)
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "12-1",
						primeForm: '["0","1","2","3","4","5","6","7","8","9","T","E"]',
						vec: "<C,C,C,C,C,6>",
						z: null,
						complement: "0-1",
						inversion: null
					},
					{
						number: "9-1",
						primeForm: '["0","1","2","3","4","5","6","7","8"]',
						vec: "<8,7,6,6,6,3>",
						z: null,
						complement: "3-1",
						inversion: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, empty space", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/%20")
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
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, contains", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/@012345679")
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

	it("should return 200 and correct data, contains and out of order", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/@021354679")
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

	it("should return 200 and correct data, contains and repeats", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/@0123456799")
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

	it("should return 200 and correct data, not and not contains", done => {
		chai
			.request(server)
			.get("/api/data/primeForm/! , !0, !@01, !@01234, !@012, !@02, !@8, !@7, !@6")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
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
						number: "3-3B",
						primeForm: '["0","3","4"]',
						vec: "<1,0,1,1,0,0>",
						z: null,
						complement: "9-3A",
						inversion: '["0","1","4"]'
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
						number: "3-7B",
						primeForm: '["0","3","5"]',
						vec: "<0,1,1,0,1,0>",
						z: null,
						complement: "9-7A",
						inversion: '["0","2","5"]'
					},
					{
						number: "4-4B",
						primeForm: '["0","3","4","5"]',
						vec: "<2,1,1,1,1,0>",
						z: null,
						complement: "8-4A",
						inversion: '["0","1","2","5"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});
});
