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

describe("GET /api/data/:queryProp/complement/:querySearch", () => {
	it("should return 414 if uri is over length", done => {
		chai
			.request(server)
			.get(
				"/api/data/complement/complement/00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
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
			.get("/api/data/complement/complement/4-z15AA")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, ^ query returns nothing", done => {
		chai
			.request(server)
			.get("/api/data/complement/complement/^00")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 400, $ query returns nothing", done => {
		chai
			.request(server)
			.get("/api/data/complement/complement/00$")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});

	it("should return 200 and correct data, null, complement", done => {
		chai
			.request(server)
			.get("/api/data/complement/complement/null")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					},
					{
						complement: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, not null and not variations, complement+z", done => {
		chai
			.request(server)
			.get("/api/data/complement,z/complement/!null,!@A,!@4,!^6,!7$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						z: null,
						complement: "12-1"
					},
					{
						z: null,
						complement: "11-1"
					},
					{
						z: null,
						complement: "10-1"
					},
					{
						z: null,
						complement: "10-2"
					},
					{
						z: null,
						complement: "10-3"
					},
					{
						z: null,
						complement: "10-5"
					},
					{
						z: null,
						complement: "10-6"
					},
					{
						z: null,
						complement: "9-1"
					},
					{
						z: null,
						complement: "9-2B"
					},
					{
						z: null,
						complement: "9-3B"
					},
					{
						z: null,
						complement: "9-5B"
					},
					{
						z: null,
						complement: "9-6"
					},
					{
						z: null,
						complement: "9-7B"
					},
					{
						z: null,
						complement: "9-8B"
					},
					{
						z: null,
						complement: "9-9"
					},
					{
						z: null,
						complement: "9-10"
					},
					{
						z: null,
						complement: "9-11B"
					},
					{
						z: null,
						complement: "9-12"
					},
					{
						z: null,
						complement: "8-1"
					},
					{
						z: null,
						complement: "8-2B"
					},
					{
						z: null,
						complement: "8-3"
					},
					{
						z: null,
						complement: "8-5B"
					},
					{
						z: null,
						complement: "8-6"
					},
					{
						z: null,
						complement: "8-8"
					},
					{
						z: null,
						complement: "8-9"
					},
					{
						z: null,
						complement: "8-10"
					},
					{
						z: null,
						complement: "8-11B"
					},
					{
						z: null,
						complement: "8-12B"
					},
					{
						z: null,
						complement: "8-13B"
					},
					{
						z: "4-z29A",
						complement: "8-z15B"
					},
					{
						z: null,
						complement: "8-16B"
					},
					{
						z: null,
						complement: "8-18B"
					},
					{
						z: null,
						complement: "8-19B"
					},
					{
						z: null,
						complement: "8-20"
					},
					{
						z: null,
						complement: "8-21"
					},
					{
						z: null,
						complement: "8-22B"
					},
					{
						z: null,
						complement: "8-23"
					},
					{
						z: null,
						complement: "8-25"
					},
					{
						z: null,
						complement: "8-26"
					},
					{
						z: null,
						complement: "8-27B"
					},
					{
						z: null,
						complement: "8-28"
					},
					{
						z: "4-z15A",
						complement: "8-z29B"
					},
					{
						z: null,
						complement: "7-1"
					},
					{
						z: null,
						complement: "7-2B"
					},
					{
						z: null,
						complement: "7-3B"
					},
					{
						z: null,
						complement: "7-5B"
					},
					{
						z: null,
						complement: "7-6B"
					},
					{
						z: null,
						complement: "7-7B"
					},
					{
						z: null,
						complement: "7-8"
					},
					{
						z: null,
						complement: "7-9B"
					},
					{
						z: null,
						complement: "7-10B"
					},
					{
						z: null,
						complement: "7-11B"
					},
					{
						z: "5-z36A",
						complement: "7-z12"
					},
					{
						z: null,
						complement: "7-13B"
					},
					{
						z: null,
						complement: "7-15"
					},
					{
						z: null,
						complement: "7-16B"
					},
					{
						z: "5-z38A",
						complement: "7-z18B"
					},
					{
						z: null,
						complement: "7-19B"
					},
					{
						z: null,
						complement: "7-20B"
					},
					{
						z: null,
						complement: "7-21B"
					},
					{
						z: null,
						complement: "7-22"
					},
					{
						z: null,
						complement: "7-23B"
					},
					{
						z: null,
						complement: "7-25B"
					},
					{
						z: null,
						complement: "7-26B"
					},
					{
						z: null,
						complement: "7-27B"
					},
					{
						z: null,
						complement: "7-28B"
					},
					{
						z: null,
						complement: "7-29B"
					},
					{
						z: null,
						complement: "7-30B"
					},
					{
						z: null,
						complement: "7-31B"
					},
					{
						z: null,
						complement: "7-32B"
					},
					{
						z: null,
						complement: "7-33"
					},
					{
						z: null,
						complement: "7-35"
					},
					{
						z: "5-z12",
						complement: "7-z36B"
					},
					{
						z: "5-z18A",
						complement: "7-z38B"
					},
					{
						z: null,
						complement: "5-1"
					},
					{
						z: null,
						complement: "5-2B"
					},
					{
						z: null,
						complement: "5-3B"
					},
					{
						z: null,
						complement: "5-5B"
					},
					{
						z: null,
						complement: "5-6B"
					},
					{
						z: null,
						complement: "5-7B"
					},
					{
						z: null,
						complement: "5-8"
					},
					{
						z: null,
						complement: "5-9B"
					},
					{
						z: null,
						complement: "5-10B"
					},
					{
						z: null,
						complement: "5-11B"
					},
					{
						z: "7-z36A",
						complement: "5-z12"
					},
					{
						z: null,
						complement: "5-13B"
					},
					{
						z: null,
						complement: "5-15"
					},
					{
						z: null,
						complement: "5-16B"
					},
					{
						z: "7-z38A",
						complement: "7-z18B"
					},
					{
						z: null,
						complement: "5-19B"
					},
					{
						z: null,
						complement: "5-20B"
					},
					{
						z: null,
						complement: "5-21B"
					},
					{
						z: null,
						complement: "5-22"
					},
					{
						z: null,
						complement: "5-23B"
					},
					{
						z: null,
						complement: "5-25B"
					},
					{
						z: null,
						complement: "5-26B"
					},
					{
						z: null,
						complement: "5-27B"
					},
					{
						z: null,
						complement: "5-28B"
					},
					{
						z: null,
						complement: "5-29B"
					},
					{
						z: null,
						complement: "5-30B"
					},
					{
						z: null,
						complement: "5-31B"
					},
					{
						z: null,
						complement: "5-32B"
					},
					{
						z: null,
						complement: "5-33"
					},
					{
						z: null,
						complement: "5-35"
					},
					{
						z: "7-z12",
						complement: "5-z36B"
					},
					{
						z: "7-z18A",
						complement: "5-z38B"
					},
					{
						z: null,
						complement: "3-1"
					},
					{
						z: null,
						complement: "3-2B"
					},
					{
						z: null,
						complement: "3-3B"
					},
					{
						z: null,
						complement: "3-5B"
					},
					{
						z: null,
						complement: "3-6"
					},
					{
						z: null,
						complement: "3-7B"
					},
					{
						z: null,
						complement: "3-8B"
					},
					{
						z: null,
						complement: "3-9"
					},
					{
						z: null,
						complement: "3-10"
					},
					{
						z: null,
						complement: "3-11B"
					},
					{
						z: null,
						complement: "3-12"
					},
					{
						z: null,
						complement: "2-1"
					},
					{
						z: null,
						complement: "2-2"
					},
					{
						z: null,
						complement: "2-3"
					},
					{
						z: null,
						complement: "2-5"
					},
					{
						z: null,
						complement: "2-6"
					},
					{
						z: null,
						complement: "1-1"
					},
					{
						z: null,
						complement: "0-1"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single exact, number+primeForm+vec+z+complement+inversion/complement/4-z15A", done => {
		chai
			.request(server)
			.get("/api/data/number,primeForm,vec,z,complement,inversion/complement/4-z15A")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "8-z15B",
						primeForm: '["0","1","3","5","6","7","8","9"]',
						vec: "<5,5,5,5,5,3>",
						z: "8-z29A",
						complement: "4-z15A",
						inversion: '["0","1","2","3","4","6","8","9"]'
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single starts with, complement", done => {
		chai
			.request(server)
			.get("/api/data/complement/complement/^4-z")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						complement: "4-z15B"
					},
					{
						complement: "4-z15A"
					},
					{
						complement: "4-z29B"
					},
					{
						complement: "4-z29A"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, single ends with, complement", done => {
		chai
			.request(server)
			.get("/api/data/complement/complement/-z15A$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						complement: "8-z15A"
					},
					{
						complement: "4-z15A"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 200 and correct data, ! and multiple exclusion methods, complement", done => {
		chai
			.request(server)
			.get("/api/data/complement/complement/!0-1,`1-1,`null,`^1,`@6,`1$,`A$")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						complement: "9-2B"
					},
					{
						complement: "9-3B"
					},
					{
						complement: "9-4B"
					},
					{
						complement: "9-5B"
					},
					{
						complement: "9-7B"
					},
					{
						complement: "9-8B"
					},
					{
						complement: "9-9"
					},
					{
						complement: "9-10"
					},
					{
						complement: "9-11B"
					},
					{
						complement: "9-12"
					},
					{
						complement: "8-2B"
					},
					{
						complement: "8-3"
					},
					{
						complement: "8-4B"
					},
					{
						complement: "8-5B"
					},
					{
						complement: "8-7"
					},
					{
						complement: "8-8"
					},
					{
						complement: "8-9"
					},
					{
						complement: "8-10"
					},
					{
						complement: "8-11B"
					},
					{
						complement: "8-12B"
					},
					{
						complement: "8-13B"
					},
					{
						complement: "8-14B"
					},
					{
						complement: "8-z15B"
					},
					{
						complement: "8-17"
					},
					{
						complement: "8-18B"
					},
					{
						complement: "8-19B"
					},
					{
						complement: "8-20"
					},
					{
						complement: "8-22B"
					},
					{
						complement: "8-23"
					},
					{
						complement: "8-24"
					},
					{
						complement: "8-25"
					},
					{
						complement: "8-27B"
					},
					{
						complement: "8-28"
					},
					{
						complement: "8-z29B"
					},
					{
						complement: "7-2B"
					},
					{
						complement: "7-3B"
					},
					{
						complement: "7-4B"
					},
					{
						complement: "7-5B"
					},
					{
						complement: "7-7B"
					},
					{
						complement: "7-8"
					},
					{
						complement: "7-9B"
					},
					{
						complement: "7-10B"
					},
					{
						complement: "7-11B"
					},
					{
						complement: "7-z12"
					},
					{
						complement: "7-13B"
					},
					{
						complement: "7-14B"
					},
					{
						complement: "7-15"
					},
					{
						complement: "7-z17"
					},
					{
						complement: "7-z18B"
					},
					{
						complement: "7-19B"
					},
					{
						complement: "7-20B"
					},
					{
						complement: "7-21B"
					},
					{
						complement: "7-22"
					},
					{
						complement: "7-23B"
					},
					{
						complement: "7-24B"
					},
					{
						complement: "7-25B"
					},
					{
						complement: "7-27B"
					},
					{
						complement: "7-28B"
					},
					{
						complement: "7-29B"
					},
					{
						complement: "7-30B"
					},
					{
						complement: "7-31B"
					},
					{
						complement: "7-32B"
					},
					{
						complement: "7-33"
					},
					{
						complement: "7-34"
					},
					{
						complement: "7-35"
					},
					{
						complement: "7-z37"
					},
					{
						complement: "7-z38B"
					},
					{
						complement: "5-2B"
					},
					{
						complement: "5-3B"
					},
					{
						complement: "5-4B"
					},
					{
						complement: "5-5B"
					},
					{
						complement: "5-7B"
					},
					{
						complement: "5-8"
					},
					{
						complement: "5-9B"
					},
					{
						complement: "5-10B"
					},
					{
						complement: "5-11B"
					},
					{
						complement: "5-z12"
					},
					{
						complement: "5-13B"
					},
					{
						complement: "5-14B"
					},
					{
						complement: "5-15"
					},
					{
						complement: "5-z17"
					},
					{
						complement: "7-z18B"
					},
					{
						complement: "5-19B"
					},
					{
						complement: "5-20B"
					},
					{
						complement: "5-21B"
					},
					{
						complement: "5-22"
					},
					{
						complement: "5-23B"
					},
					{
						complement: "5-24B"
					},
					{
						complement: "5-25B"
					},
					{
						complement: "5-27B"
					},
					{
						complement: "5-28B"
					},
					{
						complement: "5-29B"
					},
					{
						complement: "5-30B"
					},
					{
						complement: "5-31B"
					},
					{
						complement: "5-32B"
					},
					{
						complement: "5-33"
					},
					{
						complement: "5-34"
					},
					{
						complement: "5-35"
					},
					{
						complement: "5-z37"
					},
					{
						complement: "5-z38B"
					},
					{
						complement: "4-2B"
					},
					{
						complement: "4-3"
					},
					{
						complement: "4-4B"
					},
					{
						complement: "4-5B"
					},
					{
						complement: "4-7"
					},
					{
						complement: "4-8"
					},
					{
						complement: "4-9"
					},
					{
						complement: "4-10"
					},
					{
						complement: "4-11B"
					},
					{
						complement: "4-12B"
					},
					{
						complement: "4-13B"
					},
					{
						complement: "4-14B"
					},
					{
						complement: "4-z15B"
					},
					{
						complement: "4-17"
					},
					{
						complement: "4-18B"
					},
					{
						complement: "4-19B"
					},
					{
						complement: "4-20"
					},
					{
						complement: "4-22B"
					},
					{
						complement: "4-23"
					},
					{
						complement: "4-24"
					},
					{
						complement: "4-25"
					},
					{
						complement: "4-27B"
					},
					{
						complement: "4-28"
					},
					{
						complement: "4-z29B"
					},
					{
						complement: "3-2B"
					},
					{
						complement: "3-3B"
					},
					{
						complement: "3-4B"
					},
					{
						complement: "3-5B"
					},
					{
						complement: "3-7B"
					},
					{
						complement: "3-8B"
					},
					{
						complement: "3-9"
					},
					{
						complement: "3-10"
					},
					{
						complement: "3-11B"
					},
					{
						complement: "3-12"
					},
					{
						complement: "2-2"
					},
					{
						complement: "2-3"
					},
					{
						complement: "2-4"
					},
					{
						complement: "2-5"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});
});
