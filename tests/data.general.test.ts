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

describe("General API Endpoints", () => {
	describe("GET /api (does not exist)", () => {
		it("should return 404 if endpoint does not exist", done => {
			chai
				.request(server)
				.get("/api")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(404);
					done();
				});
		});
	});
});
describe("GET /api/data", () => {
	it("should return the entire dataset", done => {
		chai
			.request(server)
			.get("/api/data")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(dataCache);
				res.should.have.status(200);
				done();
			});
	});
});

describe("GET /api/data/d3/:query", () => {
	it("should return 414 if uri is over length", done => {
		chai
			.request(server)
			.get("/api/data/d3/cardinallinkprimeforte1")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(414);
				done();
			});
	});

	it("should return 400, wrong format exact", done => {
		chai
			.request(server)
			.get("/api/data/d3/cardinallinkprimefort")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 200 and correct data, cardinallinkinversions", done => {
		chai
			.request(server)
			.get("/api/data/d3/cardinallinkinversions")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["cardinallinkinversions"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, cardinaldaginversions", done => {
		chai
			.request(server)
			.get("/api/data/d3/cardinaldaginversions")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["cardinaldaginversions"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, strictlinkinversions", done => {
		chai
			.request(server)
			.get("/api/data/d3/strictlinkinversions")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["strictlinkinversions"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, strictdaginversions", done => {
		chai
			.request(server)
			.get("/api/data/d3/strictdaginversions")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["strictdaginversions"]);
				res.should.have.status(200);
				done();
			});
	});
});
