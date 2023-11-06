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

	it("should return 200 and correct data, cardinalinversionlinks", done => {
		chai
			.request(server)
			.get("/api/data/d3/cardinalinversionlinks")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["cardinalinversionlinks"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, cardinalinversiondag", done => {
		chai
			.request(server)
			.get("/api/data/d3/cardinalinversiondag")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["cardinalinversiondag"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, cardinaloriginallinks", done => {
		chai
			.request(server)
			.get("/api/data/d3/cardinaloriginallinks")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["cardinaloriginallinks"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, cardinaloriginaldag", done => {
		chai
			.request(server)
			.get("/api/data/d3/cardinaloriginaldag")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["cardinaloriginaldag"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, strictinversionlinks", done => {
		chai
			.request(server)
			.get("/api/data/d3/strictinversionlinks")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["strictinversionlinks"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, strictinversiondag", done => {
		chai
			.request(server)
			.get("/api/data/d3/strictinversiondag")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["strictinversiondag"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, strictoriginallinks", done => {
		chai
			.request(server)
			.get("/api/data/d3/strictoriginallinks")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["strictoriginallinks"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, strictoriginaldag", done => {
		chai
			.request(server)
			.get("/api/data/d3/strictoriginaldag")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["strictoriginaldag"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, vectorinversionlinks", done => {
		chai
			.request(server)
			.get("/api/data/d3/vectorinversionlinks")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["vectorinversionlinks"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, vectorinversiondag", done => {
		chai
			.request(server)
			.get("/api/data/d3/vectorinversiondag")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["vectorinversiondag"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, vectororiginallinks", done => {
		chai
			.request(server)
			.get("/api/data/d3/vectororiginallinks")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["vectororiginallinks"]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, vectororiginaldag", done => {
		chai
			.request(server)
			.get("/api/data/d3/vectororiginaldag")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(d3Data["vectororiginaldag"]);
				res.should.have.status(200);
				done();
			});
	});
});
