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

describe("GET /api/data/:queryProp", () => {
	it("should return the entire dataset", done => {
		chai
			.request(server)
			.get("/api/data/number,primeForm,vec,z,complement,inversion")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(dataCache);
				res.should.have.status(200);
				done();
			});
	});

	it("should return the entire dataset, order doesn't matter", done => {
		chai
			.request(server)
			.get("/api/data/number,primeForm,vec,complement,z,inversion")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal(dataCache);
				res.should.have.status(200);
				done();
			});
	});

	it("should return one of the props", done => {
		chai
			.request(server)
			.get("/api/data/number")
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
						number: "3-1"
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
						number: "3-9"
					},
					{
						number: "3-10"
					},
					{
						number: "3-11A"
					},
					{
						number: "3-11B"
					},
					{
						number: "3-12"
					},
					{
						number: "4-1"
					},
					{
						number: "4-2A"
					},
					{
						number: "4-2B"
					},
					{
						number: "4-3"
					},
					{
						number: "4-4A"
					},
					{
						number: "4-4B"
					},
					{
						number: "4-5A"
					},
					{
						number: "4-5B"
					},
					{
						number: "4-6"
					},
					{
						number: "4-7"
					},
					{
						number: "4-8"
					},
					{
						number: "4-9"
					},
					{
						number: "4-10"
					},
					{
						number: "4-11A"
					},
					{
						number: "4-11B"
					},
					{
						number: "4-12A"
					},
					{
						number: "4-12B"
					},
					{
						number: "4-13A"
					},
					{
						number: "4-13B"
					},
					{
						number: "4-14A"
					},
					{
						number: "4-14B"
					},
					{
						number: "4-z15A"
					},
					{
						number: "4-z15B"
					},
					{
						number: "4-16A"
					},
					{
						number: "4-16B"
					},
					{
						number: "4-17"
					},
					{
						number: "4-18A"
					},
					{
						number: "4-18B"
					},
					{
						number: "4-19A"
					},
					{
						number: "4-19B"
					},
					{
						number: "4-20"
					},
					{
						number: "4-21"
					},
					{
						number: "4-22A"
					},
					{
						number: "4-22B"
					},
					{
						number: "4-23"
					},
					{
						number: "4-24"
					},
					{
						number: "4-25"
					},
					{
						number: "4-26"
					},
					{
						number: "4-27A"
					},
					{
						number: "4-27B"
					},
					{
						number: "4-28"
					},
					{
						number: "4-z29A"
					},
					{
						number: "4-z29B"
					},
					{
						number: "5-1"
					},
					{
						number: "5-2A"
					},
					{
						number: "5-2B"
					},
					{
						number: "5-3A"
					},
					{
						number: "5-3B"
					},
					{
						number: "5-4A"
					},
					{
						number: "5-4B"
					},
					{
						number: "5-5A"
					},
					{
						number: "5-5B"
					},
					{
						number: "5-6A"
					},
					{
						number: "5-6B"
					},
					{
						number: "5-7A"
					},
					{
						number: "5-7B"
					},
					{
						number: "5-8"
					},
					{
						number: "5-9A"
					},
					{
						number: "5-9B"
					},
					{
						number: "5-10A"
					},
					{
						number: "5-10B"
					},
					{
						number: "5-11A"
					},
					{
						number: "5-11B"
					},
					{
						number: "5-z12"
					},
					{
						number: "5-13A"
					},
					{
						number: "5-13B"
					},
					{
						number: "5-14A"
					},
					{
						number: "5-14B"
					},
					{
						number: "5-15"
					},
					{
						number: "5-16A"
					},
					{
						number: "5-16B"
					},
					{
						number: "5-z17"
					},
					{
						number: "5-z18A"
					},
					{
						number: "5-z18B"
					},
					{
						number: "5-19A"
					},
					{
						number: "5-19B"
					},
					{
						number: "5-20A"
					},
					{
						number: "5-20B"
					},
					{
						number: "5-21A"
					},
					{
						number: "5-21B"
					},
					{
						number: "5-22"
					},
					{
						number: "5-23A"
					},
					{
						number: "5-23B"
					},
					{
						number: "5-24A"
					},
					{
						number: "5-24B"
					},
					{
						number: "5-25A"
					},
					{
						number: "5-25B"
					},
					{
						number: "5-26A"
					},
					{
						number: "5-26B"
					},
					{
						number: "5-27A"
					},
					{
						number: "5-27B"
					},
					{
						number: "5-28A"
					},
					{
						number: "5-28B"
					},
					{
						number: "5-29A"
					},
					{
						number: "5-29B"
					},
					{
						number: "5-30A"
					},
					{
						number: "5-30B"
					},
					{
						number: "5-31A"
					},
					{
						number: "5-31B"
					},
					{
						number: "5-32A"
					},
					{
						number: "5-32B"
					},
					{
						number: "5-33"
					},
					{
						number: "5-34"
					},
					{
						number: "5-35"
					},
					{
						number: "5-z36A"
					},
					{
						number: "5-z36B"
					},
					{
						number: "5-z37"
					},
					{
						number: "5-z38A"
					},
					{
						number: "5-z38B"
					},
					{
						number: "6-1"
					},
					{
						number: "6-2A"
					},
					{
						number: "6-2B"
					},
					{
						number: "6-z3A"
					},
					{
						number: "6-z3B"
					},
					{
						number: "6-z4"
					},
					{
						number: "6-5A"
					},
					{
						number: "6-5B"
					},
					{
						number: "6-z6"
					},
					{
						number: "6-7"
					},
					{
						number: "6-8"
					},
					{
						number: "6-9A"
					},
					{
						number: "6-9B"
					},
					{
						number: "6-z10A"
					},
					{
						number: "6-z10B"
					},
					{
						number: "6-z11A"
					},
					{
						number: "6-z11B"
					},
					{
						number: "6-z12A"
					},
					{
						number: "6-z12B"
					},
					{
						number: "6-z13"
					},
					{
						number: "6-14A"
					},
					{
						number: "6-14B"
					},
					{
						number: "6-15A"
					},
					{
						number: "6-15B"
					},
					{
						number: "6-16A"
					},
					{
						number: "6-16B"
					},
					{
						number: "6-z17A"
					},
					{
						number: "6-z17B"
					},
					{
						number: "6-18A"
					},
					{
						number: "6-18B"
					},
					{
						number: "6-z19A"
					},
					{
						number: "6-z19B"
					},
					{
						number: "6-20"
					},
					{
						number: "6-21A"
					},
					{
						number: "6-21B"
					},
					{
						number: "6-22A"
					},
					{
						number: "6-22B"
					},
					{
						number: "6-z23"
					},
					{
						number: "6-z24A"
					},
					{
						number: "6-z24B"
					},
					{
						number: "6-z25A"
					},
					{
						number: "6-z25B"
					},
					{
						number: "6-z26"
					},
					{
						number: "6-27A"
					},
					{
						number: "6-27B"
					},
					{
						number: "6-z28"
					},
					{
						number: "6-z29"
					},
					{
						number: "6-30A"
					},
					{
						number: "6-30B"
					},
					{
						number: "6-31A"
					},
					{
						number: "6-31B"
					},
					{
						number: "6-32"
					},
					{
						number: "6-33A"
					},
					{
						number: "6-33B"
					},
					{
						number: "6-34A"
					},
					{
						number: "6-34B"
					},
					{
						number: "6-35"
					},
					{
						number: "6-z36A"
					},
					{
						number: "6-z36B"
					},
					{
						number: "6-z37"
					},
					{
						number: "6-z38"
					},
					{
						number: "6-z39A"
					},
					{
						number: "6-z39B"
					},
					{
						number: "6-z40A"
					},
					{
						number: "6-z40B"
					},
					{
						number: "6-z41A"
					},
					{
						number: "6-z41B"
					},
					{
						number: "6-z42"
					},
					{
						number: "6-z43A"
					},
					{
						number: "6-z43B"
					},
					{
						number: "6-z44A"
					},
					{
						number: "6-z44B"
					},
					{
						number: "6-z45"
					},
					{
						number: "6-z46A"
					},
					{
						number: "6-z46B"
					},
					{
						number: "6-z47A"
					},
					{
						number: "6-z47B"
					},
					{
						number: "6-z48"
					},
					{
						number: "6-z49"
					},
					{
						number: "6-z50"
					},
					{
						number: "7-1"
					},
					{
						number: "7-2A"
					},
					{
						number: "7-2B"
					},
					{
						number: "7-3A"
					},
					{
						number: "7-3B"
					},
					{
						number: "7-4A"
					},
					{
						number: "7-4B"
					},
					{
						number: "7-5A"
					},
					{
						number: "7-5B"
					},
					{
						number: "7-6A"
					},
					{
						number: "7-6B"
					},
					{
						number: "7-7A"
					},
					{
						number: "7-7B"
					},
					{
						number: "7-8"
					},
					{
						number: "7-9A"
					},
					{
						number: "7-9B"
					},
					{
						number: "7-10A"
					},
					{
						number: "7-10B"
					},
					{
						number: "7-11A"
					},
					{
						number: "7-11B"
					},
					{
						number: "7-z12"
					},
					{
						number: "7-13A"
					},
					{
						number: "7-13B"
					},
					{
						number: "7-14A"
					},
					{
						number: "7-14B"
					},
					{
						number: "7-15"
					},
					{
						number: "7-16A"
					},
					{
						number: "7-16B"
					},
					{
						number: "7-z17"
					},
					{
						number: "7-z18A"
					},
					{
						number: "7-z18B"
					},
					{
						number: "7-19A"
					},
					{
						number: "7-19B"
					},
					{
						number: "7-20A"
					},
					{
						number: "7-20B"
					},
					{
						number: "7-21A"
					},
					{
						number: "7-21B"
					},
					{
						number: "7-22"
					},
					{
						number: "7-23A"
					},
					{
						number: "7-23B"
					},
					{
						number: "7-24A"
					},
					{
						number: "7-24B"
					},
					{
						number: "7-25A"
					},
					{
						number: "7-25B"
					},
					{
						number: "7-26A"
					},
					{
						number: "7-26B"
					},
					{
						number: "7-27A"
					},
					{
						number: "7-27B"
					},
					{
						number: "7-28A"
					},
					{
						number: "7-28B"
					},
					{
						number: "7-29A"
					},
					{
						number: "7-29B"
					},
					{
						number: "7-30A"
					},
					{
						number: "7-30B"
					},
					{
						number: "7-31A"
					},
					{
						number: "7-31B"
					},
					{
						number: "7-32A"
					},
					{
						number: "7-32B"
					},
					{
						number: "7-33"
					},
					{
						number: "7-34"
					},
					{
						number: "7-35"
					},
					{
						number: "7-z36A"
					},
					{
						number: "7-z36B"
					},
					{
						number: "7-z37"
					},
					{
						number: "7-z38A"
					},
					{
						number: "7-z38B"
					},
					{
						number: "8-1"
					},
					{
						number: "8-2A"
					},
					{
						number: "8-2B"
					},
					{
						number: "8-3"
					},
					{
						number: "8-4A"
					},
					{
						number: "8-4B"
					},
					{
						number: "8-5A"
					},
					{
						number: "8-5B"
					},
					{
						number: "8-6"
					},
					{
						number: "8-7"
					},
					{
						number: "8-8"
					},
					{
						number: "8-9"
					},
					{
						number: "8-10"
					},
					{
						number: "8-11A"
					},
					{
						number: "8-11B"
					},
					{
						number: "8-12A"
					},
					{
						number: "8-12B"
					},
					{
						number: "8-13A"
					},
					{
						number: "8-13B"
					},
					{
						number: "8-14A"
					},
					{
						number: "8-14B"
					},
					{
						number: "8-z15A"
					},
					{
						number: "8-z15B"
					},
					{
						number: "8-16A"
					},
					{
						number: "8-16B"
					},
					{
						number: "8-17"
					},
					{
						number: "8-18A"
					},
					{
						number: "8-18B"
					},
					{
						number: "8-19A"
					},
					{
						number: "8-19B"
					},
					{
						number: "8-20"
					},
					{
						number: "8-21"
					},
					{
						number: "8-22A"
					},
					{
						number: "8-22B"
					},
					{
						number: "8-23"
					},
					{
						number: "8-24"
					},
					{
						number: "8-25"
					},
					{
						number: "8-26"
					},
					{
						number: "8-27A"
					},
					{
						number: "8-27B"
					},
					{
						number: "8-28"
					},
					{
						number: "8-z29A"
					},
					{
						number: "8-z29B"
					},
					{
						number: "9-1"
					},
					{
						number: "9-2A"
					},
					{
						number: "9-2B"
					},
					{
						number: "9-3A"
					},
					{
						number: "9-3B"
					},
					{
						number: "9-4A"
					},
					{
						number: "9-4B"
					},
					{
						number: "9-5A"
					},
					{
						number: "9-5B"
					},
					{
						number: "9-6"
					},
					{
						number: "9-7A"
					},
					{
						number: "9-7B"
					},
					{
						number: "9-8A"
					},
					{
						number: "9-8B"
					},
					{
						number: "9-9"
					},
					{
						number: "9-10"
					},
					{
						number: "9-11A"
					},
					{
						number: "9-11B"
					},
					{
						number: "9-12"
					},
					{
						number: "10-1"
					},
					{
						number: "10-2"
					},
					{
						number: "10-3"
					},
					{
						number: "10-4"
					},
					{
						number: "10-5"
					},
					{
						number: "10-6"
					},
					{
						number: "11-1"
					},
					{
						number: "12-1"
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return multiple props but less than the full data", done => {
		chai
			.request(server)
			.get("/api/data/number,z")
			.end((err, res) => {
				should.not.exist(err);
				res.body.should.deep.equal([
					{
						number: "0-1",
						z: null
					},
					{
						number: "1-1",
						z: null
					},
					{
						number: "2-1",
						z: null
					},
					{
						number: "2-2",
						z: null
					},
					{
						number: "2-3",
						z: null
					},
					{
						number: "2-4",
						z: null
					},
					{
						number: "2-5",
						z: null
					},
					{
						number: "2-6",
						z: null
					},
					{
						number: "3-1",
						z: null
					},
					{
						number: "3-2A",
						z: null
					},
					{
						number: "3-2B",
						z: null
					},
					{
						number: "3-3A",
						z: null
					},
					{
						number: "3-3B",
						z: null
					},
					{
						number: "3-4A",
						z: null
					},
					{
						number: "3-4B",
						z: null
					},
					{
						number: "3-5A",
						z: null
					},
					{
						number: "3-5B",
						z: null
					},
					{
						number: "3-6",
						z: null
					},
					{
						number: "3-7A",
						z: null
					},
					{
						number: "3-7B",
						z: null
					},
					{
						number: "3-8A",
						z: null
					},
					{
						number: "3-8B",
						z: null
					},
					{
						number: "3-9",
						z: null
					},
					{
						number: "3-10",
						z: null
					},
					{
						number: "3-11A",
						z: null
					},
					{
						number: "3-11B",
						z: null
					},
					{
						number: "3-12",
						z: null
					},
					{
						number: "4-1",
						z: null
					},
					{
						number: "4-2A",
						z: null
					},
					{
						number: "4-2B",
						z: null
					},
					{
						number: "4-3",
						z: null
					},
					{
						number: "4-4A",
						z: null
					},
					{
						number: "4-4B",
						z: null
					},
					{
						number: "4-5A",
						z: null
					},
					{
						number: "4-5B",
						z: null
					},
					{
						number: "4-6",
						z: null
					},
					{
						number: "4-7",
						z: null
					},
					{
						number: "4-8",
						z: null
					},
					{
						number: "4-9",
						z: null
					},
					{
						number: "4-10",
						z: null
					},
					{
						number: "4-11A",
						z: null
					},
					{
						number: "4-11B",
						z: null
					},
					{
						number: "4-12A",
						z: null
					},
					{
						number: "4-12B",
						z: null
					},
					{
						number: "4-13A",
						z: null
					},
					{
						number: "4-13B",
						z: null
					},
					{
						number: "4-14A",
						z: null
					},
					{
						number: "4-14B",
						z: null
					},
					{
						number: "4-z15A",
						z: "4-z29A"
					},
					{
						number: "4-z15B",
						z: "4-z29A"
					},
					{
						number: "4-16A",
						z: null
					},
					{
						number: "4-16B",
						z: null
					},
					{
						number: "4-17",
						z: null
					},
					{
						number: "4-18A",
						z: null
					},
					{
						number: "4-18B",
						z: null
					},
					{
						number: "4-19A",
						z: null
					},
					{
						number: "4-19B",
						z: null
					},
					{
						number: "4-20",
						z: null
					},
					{
						number: "4-21",
						z: null
					},
					{
						number: "4-22A",
						z: null
					},
					{
						number: "4-22B",
						z: null
					},
					{
						number: "4-23",
						z: null
					},
					{
						number: "4-24",
						z: null
					},
					{
						number: "4-25",
						z: null
					},
					{
						number: "4-26",
						z: null
					},
					{
						number: "4-27A",
						z: null
					},
					{
						number: "4-27B",
						z: null
					},
					{
						number: "4-28",
						z: null
					},
					{
						number: "4-z29A",
						z: "4-z15A"
					},
					{
						number: "4-z29B",
						z: "4-z15A"
					},
					{
						number: "5-1",
						z: null
					},
					{
						number: "5-2A",
						z: null
					},
					{
						number: "5-2B",
						z: null
					},
					{
						number: "5-3A",
						z: null
					},
					{
						number: "5-3B",
						z: null
					},
					{
						number: "5-4A",
						z: null
					},
					{
						number: "5-4B",
						z: null
					},
					{
						number: "5-5A",
						z: null
					},
					{
						number: "5-5B",
						z: null
					},
					{
						number: "5-6A",
						z: null
					},
					{
						number: "5-6B",
						z: null
					},
					{
						number: "5-7A",
						z: null
					},
					{
						number: "5-7B",
						z: null
					},
					{
						number: "5-8",
						z: null
					},
					{
						number: "5-9A",
						z: null
					},
					{
						number: "5-9B",
						z: null
					},
					{
						number: "5-10A",
						z: null
					},
					{
						number: "5-10B",
						z: null
					},
					{
						number: "5-11A",
						z: null
					},
					{
						number: "5-11B",
						z: null
					},
					{
						number: "5-z12",
						z: "5-z36A"
					},
					{
						number: "5-13A",
						z: null
					},
					{
						number: "5-13B",
						z: null
					},
					{
						number: "5-14A",
						z: null
					},
					{
						number: "5-14B",
						z: null
					},
					{
						number: "5-15",
						z: null
					},
					{
						number: "5-16A",
						z: null
					},
					{
						number: "5-16B",
						z: null
					},
					{
						number: "5-z17",
						z: "5-z37"
					},
					{
						number: "5-z18A",
						z: "5-z38A"
					},
					{
						number: "5-z18B",
						z: "5-z38A"
					},
					{
						number: "5-19A",
						z: null
					},
					{
						number: "5-19B",
						z: null
					},
					{
						number: "5-20A",
						z: null
					},
					{
						number: "5-20B",
						z: null
					},
					{
						number: "5-21A",
						z: null
					},
					{
						number: "5-21B",
						z: null
					},
					{
						number: "5-22",
						z: null
					},
					{
						number: "5-23A",
						z: null
					},
					{
						number: "5-23B",
						z: null
					},
					{
						number: "5-24A",
						z: null
					},
					{
						number: "5-24B",
						z: null
					},
					{
						number: "5-25A",
						z: null
					},
					{
						number: "5-25B",
						z: null
					},
					{
						number: "5-26A",
						z: null
					},
					{
						number: "5-26B",
						z: null
					},
					{
						number: "5-27A",
						z: null
					},
					{
						number: "5-27B",
						z: null
					},
					{
						number: "5-28A",
						z: null
					},
					{
						number: "5-28B",
						z: null
					},
					{
						number: "5-29A",
						z: null
					},
					{
						number: "5-29B",
						z: null
					},
					{
						number: "5-30A",
						z: null
					},
					{
						number: "5-30B",
						z: null
					},
					{
						number: "5-31A",
						z: null
					},
					{
						number: "5-31B",
						z: null
					},
					{
						number: "5-32A",
						z: null
					},
					{
						number: "5-32B",
						z: null
					},
					{
						number: "5-33",
						z: null
					},
					{
						number: "5-34",
						z: null
					},
					{
						number: "5-35",
						z: null
					},
					{
						number: "5-z36A",
						z: "5-z12"
					},
					{
						number: "5-z36B",
						z: "5-z12"
					},
					{
						number: "5-z37",
						z: "5-z17"
					},
					{
						number: "5-z38A",
						z: "5-z18A"
					},
					{
						number: "5-z38B",
						z: "5-z18A"
					},
					{
						number: "6-1",
						z: null
					},
					{
						number: "6-2A",
						z: null
					},
					{
						number: "6-2B",
						z: null
					},
					{
						number: "6-z3A",
						z: "6-z36A"
					},
					{
						number: "6-z3B",
						z: "6-z36A"
					},
					{
						number: "6-z4",
						z: "6-z37"
					},
					{
						number: "6-5A",
						z: null
					},
					{
						number: "6-5B",
						z: null
					},
					{
						number: "6-z6",
						z: "6-z38"
					},
					{
						number: "6-7",
						z: null
					},
					{
						number: "6-8",
						z: null
					},
					{
						number: "6-9A",
						z: null
					},
					{
						number: "6-9B",
						z: null
					},
					{
						number: "6-z10A",
						z: "6-z39A"
					},
					{
						number: "6-z10B",
						z: "6-z39A"
					},
					{
						number: "6-z11A",
						z: "6-z40A"
					},
					{
						number: "6-z11B",
						z: "6-z40A"
					},
					{
						number: "6-z12A",
						z: "6-z41A"
					},
					{
						number: "6-z12B",
						z: "6-z41A"
					},
					{
						number: "6-z13",
						z: "6-z42"
					},
					{
						number: "6-14A",
						z: null
					},
					{
						number: "6-14B",
						z: null
					},
					{
						number: "6-15A",
						z: null
					},
					{
						number: "6-15B",
						z: null
					},
					{
						number: "6-16A",
						z: null
					},
					{
						number: "6-16B",
						z: null
					},
					{
						number: "6-z17A",
						z: "6-z43A"
					},
					{
						number: "6-z17B",
						z: "6-z43A"
					},
					{
						number: "6-18A",
						z: null
					},
					{
						number: "6-18B",
						z: null
					},
					{
						number: "6-z19A",
						z: "6-z44A"
					},
					{
						number: "6-z19B",
						z: "6-z44A"
					},
					{
						number: "6-20",
						z: null
					},
					{
						number: "6-21A",
						z: null
					},
					{
						number: "6-21B",
						z: null
					},
					{
						number: "6-22A",
						z: null
					},
					{
						number: "6-22B",
						z: null
					},
					{
						number: "6-z23",
						z: "6-z45"
					},
					{
						number: "6-z24A",
						z: "6-z46A"
					},
					{
						number: "6-z24B",
						z: "6-z46A"
					},
					{
						number: "6-z25A",
						z: "6-z47A"
					},
					{
						number: "6-z25B",
						z: "6-z47A"
					},
					{
						number: "6-z26",
						z: "6-z48"
					},
					{
						number: "6-27A",
						z: null
					},
					{
						number: "6-27B",
						z: null
					},
					{
						number: "6-z28",
						z: "6-z49"
					},
					{
						number: "6-z29",
						z: "6-z50"
					},
					{
						number: "6-30A",
						z: null
					},
					{
						number: "6-30B",
						z: null
					},
					{
						number: "6-31A",
						z: null
					},
					{
						number: "6-31B",
						z: null
					},
					{
						number: "6-32",
						z: null
					},
					{
						number: "6-33A",
						z: null
					},
					{
						number: "6-33B",
						z: null
					},
					{
						number: "6-34A",
						z: null
					},
					{
						number: "6-34B",
						z: null
					},
					{
						number: "6-35",
						z: null
					},
					{
						number: "6-z36A",
						z: "6-z3A"
					},
					{
						number: "6-z36B",
						z: "6-z3A"
					},
					{
						number: "6-z37",
						z: "6-z4"
					},
					{
						number: "6-z38",
						z: "6-z6"
					},
					{
						number: "6-z39A",
						z: "6-z10A"
					},
					{
						number: "6-z39B",
						z: "6-z10A"
					},
					{
						number: "6-z40A",
						z: "6-z11A"
					},
					{
						number: "6-z40B",
						z: "6-z11A"
					},
					{
						number: "6-z41A",
						z: "6-z12A"
					},
					{
						number: "6-z41B",
						z: "6-z12A"
					},
					{
						number: "6-z42",
						z: "6-z13"
					},
					{
						number: "6-z43A",
						z: "6-z17A"
					},
					{
						number: "6-z43B",
						z: "6-z17A"
					},
					{
						number: "6-z44A",
						z: "6-z19A"
					},
					{
						number: "6-z44B",
						z: "6-z19A"
					},
					{
						number: "6-z45",
						z: "6-z23"
					},
					{
						number: "6-z46A",
						z: "6-z24A"
					},
					{
						number: "6-z46B",
						z: "6-z24A"
					},
					{
						number: "6-z47A",
						z: "6-z25A"
					},
					{
						number: "6-z47B",
						z: "6-z25A"
					},
					{
						number: "6-z48",
						z: "6-z26"
					},
					{
						number: "6-z49",
						z: "6-z28"
					},
					{
						number: "6-z50",
						z: "6-z29"
					},
					{
						number: "7-1",
						z: null
					},
					{
						number: "7-2A",
						z: null
					},
					{
						number: "7-2B",
						z: null
					},
					{
						number: "7-3A",
						z: null
					},
					{
						number: "7-3B",
						z: null
					},
					{
						number: "7-4A",
						z: null
					},
					{
						number: "7-4B",
						z: null
					},
					{
						number: "7-5A",
						z: null
					},
					{
						number: "7-5B",
						z: null
					},
					{
						number: "7-6A",
						z: null
					},
					{
						number: "7-6B",
						z: null
					},
					{
						number: "7-7A",
						z: null
					},
					{
						number: "7-7B",
						z: null
					},
					{
						number: "7-8",
						z: null
					},
					{
						number: "7-9A",
						z: null
					},
					{
						number: "7-9B",
						z: null
					},
					{
						number: "7-10A",
						z: null
					},
					{
						number: "7-10B",
						z: null
					},
					{
						number: "7-11A",
						z: null
					},
					{
						number: "7-11B",
						z: null
					},
					{
						number: "7-z12",
						z: "7-z36A"
					},
					{
						number: "7-13A",
						z: null
					},
					{
						number: "7-13B",
						z: null
					},
					{
						number: "7-14A",
						z: null
					},
					{
						number: "7-14B",
						z: null
					},
					{
						number: "7-15",
						z: null
					},
					{
						number: "7-16A",
						z: null
					},
					{
						number: "7-16B",
						z: null
					},
					{
						number: "7-z17",
						z: "7-z37"
					},
					{
						number: "7-z18A",
						z: "7-z38A"
					},
					{
						number: "7-z18B",
						z: "7-z38A"
					},
					{
						number: "7-19A",
						z: null
					},
					{
						number: "7-19B",
						z: null
					},
					{
						number: "7-20A",
						z: null
					},
					{
						number: "7-20B",
						z: null
					},
					{
						number: "7-21A",
						z: null
					},
					{
						number: "7-21B",
						z: null
					},
					{
						number: "7-22",
						z: null
					},
					{
						number: "7-23A",
						z: null
					},
					{
						number: "7-23B",
						z: null
					},
					{
						number: "7-24A",
						z: null
					},
					{
						number: "7-24B",
						z: null
					},
					{
						number: "7-25A",
						z: null
					},
					{
						number: "7-25B",
						z: null
					},
					{
						number: "7-26A",
						z: null
					},
					{
						number: "7-26B",
						z: null
					},
					{
						number: "7-27A",
						z: null
					},
					{
						number: "7-27B",
						z: null
					},
					{
						number: "7-28A",
						z: null
					},
					{
						number: "7-28B",
						z: null
					},
					{
						number: "7-29A",
						z: null
					},
					{
						number: "7-29B",
						z: null
					},
					{
						number: "7-30A",
						z: null
					},
					{
						number: "7-30B",
						z: null
					},
					{
						number: "7-31A",
						z: null
					},
					{
						number: "7-31B",
						z: null
					},
					{
						number: "7-32A",
						z: null
					},
					{
						number: "7-32B",
						z: null
					},
					{
						number: "7-33",
						z: null
					},
					{
						number: "7-34",
						z: null
					},
					{
						number: "7-35",
						z: null
					},
					{
						number: "7-z36A",
						z: "7-z12"
					},
					{
						number: "7-z36B",
						z: "7-z12"
					},
					{
						number: "7-z37",
						z: "7-z17"
					},
					{
						number: "7-z38A",
						z: "7-z18A"
					},
					{
						number: "7-z38B",
						z: "7-z18A"
					},
					{
						number: "8-1",
						z: null
					},
					{
						number: "8-2A",
						z: null
					},
					{
						number: "8-2B",
						z: null
					},
					{
						number: "8-3",
						z: null
					},
					{
						number: "8-4A",
						z: null
					},
					{
						number: "8-4B",
						z: null
					},
					{
						number: "8-5A",
						z: null
					},
					{
						number: "8-5B",
						z: null
					},
					{
						number: "8-6",
						z: null
					},
					{
						number: "8-7",
						z: null
					},
					{
						number: "8-8",
						z: null
					},
					{
						number: "8-9",
						z: null
					},
					{
						number: "8-10",
						z: null
					},
					{
						number: "8-11A",
						z: null
					},
					{
						number: "8-11B",
						z: null
					},
					{
						number: "8-12A",
						z: null
					},
					{
						number: "8-12B",
						z: null
					},
					{
						number: "8-13A",
						z: null
					},
					{
						number: "8-13B",
						z: null
					},
					{
						number: "8-14A",
						z: null
					},
					{
						number: "8-14B",
						z: null
					},
					{
						number: "8-z15A",
						z: "8-z29A"
					},
					{
						number: "8-z15B",
						z: "8-z29A"
					},
					{
						number: "8-16A",
						z: null
					},
					{
						number: "8-16B",
						z: null
					},
					{
						number: "8-17",
						z: null
					},
					{
						number: "8-18A",
						z: null
					},
					{
						number: "8-18B",
						z: null
					},
					{
						number: "8-19A",
						z: null
					},
					{
						number: "8-19B",
						z: null
					},
					{
						number: "8-20",
						z: null
					},
					{
						number: "8-21",
						z: null
					},
					{
						number: "8-22A",
						z: null
					},
					{
						number: "8-22B",
						z: null
					},
					{
						number: "8-23",
						z: null
					},
					{
						number: "8-24",
						z: null
					},
					{
						number: "8-25",
						z: null
					},
					{
						number: "8-26",
						z: null
					},
					{
						number: "8-27A",
						z: null
					},
					{
						number: "8-27B",
						z: null
					},
					{
						number: "8-28",
						z: null
					},
					{
						number: "8-z29A",
						z: "8-z15A"
					},
					{
						number: "8-z29B",
						z: "8-z15A"
					},
					{
						number: "9-1",
						z: null
					},
					{
						number: "9-2A",
						z: null
					},
					{
						number: "9-2B",
						z: null
					},
					{
						number: "9-3A",
						z: null
					},
					{
						number: "9-3B",
						z: null
					},
					{
						number: "9-4A",
						z: null
					},
					{
						number: "9-4B",
						z: null
					},
					{
						number: "9-5A",
						z: null
					},
					{
						number: "9-5B",
						z: null
					},
					{
						number: "9-6",
						z: null
					},
					{
						number: "9-7A",
						z: null
					},
					{
						number: "9-7B",
						z: null
					},
					{
						number: "9-8A",
						z: null
					},
					{
						number: "9-8B",
						z: null
					},
					{
						number: "9-9",
						z: null
					},
					{
						number: "9-10",
						z: null
					},
					{
						number: "9-11A",
						z: null
					},
					{
						number: "9-11B",
						z: null
					},
					{
						number: "9-12",
						z: null
					},
					{
						number: "10-1",
						z: null
					},
					{
						number: "10-2",
						z: null
					},
					{
						number: "10-3",
						z: null
					},
					{
						number: "10-4",
						z: null
					},
					{
						number: "10-5",
						z: null
					},
					{
						number: "10-6",
						z: null
					},
					{
						number: "11-1",
						z: null
					},
					{
						number: "12-1",
						z: null
					}
				]);
				res.should.have.status(200);
				done();
			});
	});

	it("should return 414 over 43", done => {
		chai
			.request(server)
			.get("/api/data/number,primeForm,z,vec,complement,inversions")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(414);
				done();
			});
	});

	it("should return 400 if incorrect prop", done => {
		chai
			.request(server)
			.get("/api/data/primeform")
			.end((err, res) => {
				should.not.exist(err);
				res.should.have.status(400);
				done();
			});
	});
});
