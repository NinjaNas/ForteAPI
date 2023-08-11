import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/index";
const should = chai.should();
import fs from "fs/promises";

chai.use(chaiHttp);

type DataSet = {
	number: string;
	primeForm: string;
	vec: string;
	z: null | string;
};

type props = "number" | "primeForm" | "vec" | "z";

let dataCache: DataSet[];

const flatData: { [key: string]: (null | string)[] } = {};

fs.readFile("./data/set_classes.json", "utf8")
	.then(data => {
		dataCache = JSON.parse(data);
		flatData["prop"] = ["number", "primeForm", "vec", "z"];
		flatData.prop.forEach(prop => {
			flatData[prop as props] = dataCache.map(e => e[prop as props]);
		});
	})
	.catch(err => {
		console.error("Error reading the data file:", err);
	});

describe("API Endpoints", () => {
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

	describe("GET /api/data/:prop", () => {
		it("should return the number dataset", done => {
			chai
				.request(server)
				.get("/api/data/number")
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
				.get("/api/data/primeForm")
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
				.get("/api/data/vec")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal(flatData.vec);
					res.should.have.status(200);
					done();
				});
		});
		it("should return the entire dataset", done => {
			chai
				.request(server)
				.get("/api/data/z")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal(flatData.z);
					res.should.have.status(200);
					done();
				});
		});
	});

	describe("GET /api/number/:query", () => {
		it("should return 414 if uri is over length", done => {
			chai
				.request(server)
				.get(
					"/api/data/number/0-1,1-1,2-1,2-2,2-3,2-4,2-5,2-6,3-2A,3-2B,3-3A,3-3B,3-4A,3-4B,3-5A,3-5B,3-6,3-7A,3-7B,3-8A,3-8B,3-11A"
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
				.get("/api/data/number/2-1~2-1")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, single range error multiple querys", done => {
			chai
				.request(server)
				.get("/api/data/number/2-1,2-1~2-1")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, error query not found", done => {
			chai
				.request(server)
				.get("/api/data/number/0-2")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, error invalid query", done => {
			chai
				.request(server)
				.get("/api/data/number/2312fafa1")
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
					"/api/data/number/0-1,1-1,2-1,2-2,2-3,2-4,2-5,2-6,3-2A,3-2B,3-3A,3-3B,3-4A,3-4B,3-5A,3-5B,3-6,3-7A,3-7B,3-8A,3-8B,4-2A"
				)
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "0-1",
							primeForm: "[]",
							vec: "<0,0,0,0,0,0>",
							z: null
						},
						{
							number: "1-1",
							primeForm: "[0]",
							vec: "<0,0,0,0,0,0>",
							z: null
						},
						{
							number: "2-1",
							primeForm: "[0,1]",
							vec: "<1,0,0,0,0,0>",
							z: null
						},
						{
							number: "2-2",
							primeForm: "[0,2]",
							vec: "<0,1,0,0,0,0>",
							z: null
						},
						{
							number: "2-3",
							primeForm: "[0,3]",
							vec: "<0,0,1,0,0,0>",
							z: null
						},
						{
							number: "2-4",
							primeForm: "[0,4]",
							vec: "<0,0,0,1,0,0>",
							z: null
						},
						{
							number: "2-5",
							primeForm: "[0,5]",
							vec: "<0,0,0,0,1,0>",
							z: null
						},
						{
							number: "2-6",
							primeForm: "[0,6]",
							vec: "<0,0,0,0,0,1>",
							z: null
						},
						{
							number: "3-2A",
							primeForm: "[0,1,3]",
							vec: "<1,1,1,0,0,0>",
							z: null
						},
						{
							number: "3-2B",
							primeForm: "[0,2,3]",
							vec: "<1,1,1,0,0,0>",
							z: null
						},
						{
							number: "3-3A",
							primeForm: "[0,1,4]",
							vec: "<1,0,1,1,0,0>",
							z: null
						},
						{
							number: "3-3B",
							primeForm: "[0,3,4]",
							vec: "<1,0,1,1,0,0>",
							z: null
						},
						{
							number: "3-4A",
							primeForm: "[0,1,5]",
							vec: "<1,0,0,1,1,0>",
							z: null
						},
						{
							number: "3-4B",
							primeForm: "[0,4,5]",
							vec: "<1,0,0,1,1,0>",
							z: null
						},
						{
							number: "3-5A",
							primeForm: "[0,1,6]",
							vec: "<1,0,0,0,1,1>",
							z: null
						},
						{
							number: "3-5B",
							primeForm: "[0,5,6]",
							vec: "<1,0,0,0,1,1>",
							z: null
						},
						{
							number: "3-6",
							primeForm: "[0,2,4]",
							vec: "<0,2,0,1,0,0>",
							z: null
						},
						{
							number: "3-7A",
							primeForm: "[0,2,5]",
							vec: "<0,1,1,0,1,0>",
							z: null
						},
						{
							number: "3-7B",
							primeForm: "[0,3,5]",
							vec: "<0,1,1,0,1,0>",
							z: null
						},
						{
							number: "3-8A",
							primeForm: "[0,2,6]",
							vec: "<0,1,0,1,0,1>",
							z: null
						},
						{
							number: "3-8B",
							primeForm: "[0,4,6]",
							vec: "<0,1,0,1,0,1>",
							z: null
						},
						{
							number: "4-2A",
							primeForm: "[0,1,2,4]",
							vec: "<2,2,1,1,0,0>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, all methods no duplicates", done => {
			chai
				.request(server)
				.get("/api/data/number/2-1,2-1~2-2,^3-3,-z50$")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "2-1",
							primeForm: "[0,1]",
							vec: "<1,0,0,0,0,0>",
							z: null
						},
						{
							number: "2-2",
							primeForm: "[0,2]",
							vec: "<0,1,0,0,0,0>",
							z: null
						},
						{
							number: "3-3A",
							primeForm: "[0,1,4]",
							vec: "<1,0,1,1,0,0>",
							z: null
						},
						{
							number: "3-3B",
							primeForm: "[0,3,4]",
							vec: "<1,0,1,1,0,0>",
							z: null
						},
						{
							number: "6-z50",
							primeForm: "[0,1,4,6,7,9]",
							vec: "<2,2,4,2,3,2>",
							z: "6-z29"
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, no duplicates", done => {
			chai
				.request(server)
				.get("/api/data/number/2-1,2-1,2-1,2-1")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "2-1",
							primeForm: "[0,1]",
							vec: "<1,0,0,0,0,0>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, single exact", done => {
			chai
				.request(server)
				.get("/api/data/number/2-1")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "2-1",
							primeForm: "[0,1]",
							vec: "<1,0,0,0,0,0>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, single exact regex", done => {
			chai
				.request(server)
				.get("/api/data/number/^2-1$")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "2-1",
							primeForm: "[0,1]",
							vec: "<1,0,0,0,0,0>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, multi range", done => {
			chai
				.request(server)
				.get("/api/data/number/2-1~2-4")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "2-1",
							primeForm: "[0,1]",
							vec: "<1,0,0,0,0,0>",
							z: null
						},
						{
							number: "2-2",
							primeForm: "[0,2]",
							vec: "<0,1,0,0,0,0>",
							z: null
						},
						{
							number: "2-3",
							primeForm: "[0,3]",
							vec: "<0,0,1,0,0,0>",
							z: null
						},
						{
							number: "2-4",
							primeForm: "[0,4]",
							vec: "<0,0,0,1,0,0>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, single starts with", done => {
			chai
				.request(server)
				.get("/api/data/number/^4-z")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "4-z15A",
							primeForm: "[0,1,4,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						},
						{
							number: "4-z15B",
							primeForm: "[0,2,5,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						},
						{
							number: "4-z29A",
							primeForm: "[0,1,3,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						},
						{
							number: "4-z29B",
							primeForm: "[0,4,6,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, single ends with", done => {
			chai
				.request(server)
				.get("/api/data/number/-z50$")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "6-z50",
							primeForm: "[0,1,4,6,7,9]",
							vec: "<2,2,4,2,3,2>",
							z: "6-z29"
						}
					]);
					res.should.have.status(200);
					done();
				});
		});
	});

	describe("GET /api/data/primeForm/:query", () => {
		it("should return 414 if uri is over length", done => {
			chai
				.request(server)
				.get("/api/data/primeForm/[0,1,2,3,4,5,6,7,8,9,T,E,]")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(414);
					done();
				});
		});

		it("should return 400, wrong order exact", done => {
			chai
				.request(server)
				.get("/api/data/primeForm/[1,0]")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, wrong format", done => {
			chai
				.request(server)
				.get("/api/data/primeForm/[01234]")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, wrong format fuzzy", done => {
			chai
				.request(server)
				.get("/api/data/primeForm/0,1,2,3,4")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 200 and correct data, length stress test", done => {
			chai
				.request(server)
				.get("/api/data/primeForm/[0,1,2,3,4,5,6,7,8,9,T,E]")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "12-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9,T,E]",
							vec: "<C,C,C,C,C,6>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, empty array", done => {
			chai
				.request(server)
				.get("/api/data/primeForm/[]")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "0-1",
							primeForm: "[]",
							vec: "<0,0,0,0,0,0>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, fuzzy", done => {
			chai
				.request(server)
				.get("/api/data/primeForm/012345679")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "9-2A",
							primeForm: "[0,1,2,3,4,5,6,7,9]",
							vec: "<7,7,7,6,6,3>",
							z: null
						},
						{
							number: "10-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9]",
							vec: "<9,8,8,8,8,4>",
							z: null
						},
						{
							number: "10-3",
							primeForm: "[0,1,2,3,4,5,6,7,9,T]",
							vec: "<8,8,9,8,8,4>",
							z: null
						},
						{
							number: "11-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9,T]",
							vec: "<T,T,T,T,T,5>",
							z: null
						},
						{
							number: "12-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9,T,E]",
							vec: "<C,C,C,C,C,6>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, fuzzy and out of order", done => {
			chai
				.request(server)
				.get("/api/data/primeForm/021354679")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "9-2A",
							primeForm: "[0,1,2,3,4,5,6,7,9]",
							vec: "<7,7,7,6,6,3>",
							z: null
						},
						{
							number: "10-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9]",
							vec: "<9,8,8,8,8,4>",
							z: null
						},
						{
							number: "10-3",
							primeForm: "[0,1,2,3,4,5,6,7,9,T]",
							vec: "<8,8,9,8,8,4>",
							z: null
						},
						{
							number: "11-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9,T]",
							vec: "<T,T,T,T,T,5>",
							z: null
						},
						{
							number: "12-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9,T,E]",
							vec: "<C,C,C,C,C,6>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, fuzzy and repeats", done => {
			chai
				.request(server)
				.get("/api/data/primeForm/0123456799")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "9-2A",
							primeForm: "[0,1,2,3,4,5,6,7,9]",
							vec: "<7,7,7,6,6,3>",
							z: null
						},
						{
							number: "10-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9]",
							vec: "<9,8,8,8,8,4>",
							z: null
						},
						{
							number: "10-3",
							primeForm: "[0,1,2,3,4,5,6,7,9,T]",
							vec: "<8,8,9,8,8,4>",
							z: null
						},
						{
							number: "11-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9,T]",
							vec: "<T,T,T,T,T,5>",
							z: null
						},
						{
							number: "12-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9,T,E]",
							vec: "<C,C,C,C,C,6>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});
	});
	describe("GET /api/vec/:query", () => {
		it("should return 414 if uri is over length", done => {
			chai
				.request(server)
				.get("/api/data/vec/<1,1,1,1,1,1,>")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(414);
					done();
				});
		});

		it("should return 400, wrong format exact", done => {
			chai
				.request(server)
				.get("/api/data/vec/<111111>")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, wrong length under exact", done => {
			chai
				.request(server)
				.get("/api/data/vec/<1,1,1,1,1>")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, wrong format", done => {
			chai
				.request(server)
				.get("/api/data/vec/dfdfdfd")
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
				.get("/api/data/vec/<1,1,1,1,1,1>")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "4-z15A",
							primeForm: "[0,1,4,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						},
						{
							number: "4-z15B",
							primeForm: "[0,2,5,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						},
						{
							number: "4-z29A",
							primeForm: "[0,1,3,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						},
						{
							number: "4-z29B",
							primeForm: "[0,4,6,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
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
							primeForm: "[0,2,3,6]",
							vec: "<1,1,2,1,0,1>",
							z: null
						},
						{
							number: "4-12B",
							primeForm: "[0,3,4,6]",
							vec: "<1,1,2,1,0,1>",
							z: null
						},
						{
							number: "4-z15A",
							primeForm: "[0,1,4,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						},
						{
							number: "4-z15B",
							primeForm: "[0,2,5,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						},
						{
							number: "4-16A",
							primeForm: "[0,1,5,7]",
							vec: "<1,1,0,1,2,1>",
							z: null
						},
						{
							number: "4-16B",
							primeForm: "[0,2,6,7]",
							vec: "<1,1,0,1,2,1>",
							z: null
						},
						{
							number: "4-z29A",
							primeForm: "[0,1,3,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						},
						{
							number: "4-z29B",
							primeForm: "[0,4,6,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						}
					]);
					res.should.have.status(200);
					done();
				});
		});
	});

	describe("GET /api/z/:query", () => {
		it("should return 414 if uri is over length", done => {
			chai
				.request(server)
				.get("/api/data/z/^4-z15AA$")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(414);
					done();
				});
		});

		it("should return 400, wrong format exact", done => {
			chai
				.request(server)
				.get("/api/data/z/4-z15AA")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, swap ^ and $", done => {
			chai
				.request(server)
				.get("/api/data/z/$4-z15A^")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, ^ query returns nothing", done => {
			chai
				.request(server)
				.get("/api/data/z/^00")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 400, $ query returns nothing", done => {
			chai
				.request(server)
				.get("/api/data/z/00$")
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(400);
					done();
				});
		});

		it("should return 200 and correct data, null", done => {
			chai
				.request(server)
				.get("/api/data/z/null")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "0-1",
							primeForm: "[]",
							vec: "<0,0,0,0,0,0>",
							z: null
						},
						{
							number: "1-1",
							primeForm: "[0]",
							vec: "<0,0,0,0,0,0>",
							z: null
						},
						{
							number: "2-1",
							primeForm: "[0,1]",
							vec: "<1,0,0,0,0,0>",
							z: null
						},
						{
							number: "2-2",
							primeForm: "[0,2]",
							vec: "<0,1,0,0,0,0>",
							z: null
						},
						{
							number: "2-3",
							primeForm: "[0,3]",
							vec: "<0,0,1,0,0,0>",
							z: null
						},
						{
							number: "2-4",
							primeForm: "[0,4]",
							vec: "<0,0,0,1,0,0>",
							z: null
						},
						{
							number: "2-5",
							primeForm: "[0,5]",
							vec: "<0,0,0,0,1,0>",
							z: null
						},
						{
							number: "2-6",
							primeForm: "[0,6]",
							vec: "<0,0,0,0,0,1>",
							z: null
						},
						{
							number: "3-1",
							primeForm: "[0,1,2]",
							vec: "<2,1,0,0,0,0>",
							z: null
						},
						{
							number: "3-2A",
							primeForm: "[0,1,3]",
							vec: "<1,1,1,0,0,0>",
							z: null
						},
						{
							number: "3-2B",
							primeForm: "[0,2,3]",
							vec: "<1,1,1,0,0,0>",
							z: null
						},
						{
							number: "3-3A",
							primeForm: "[0,1,4]",
							vec: "<1,0,1,1,0,0>",
							z: null
						},
						{
							number: "3-3B",
							primeForm: "[0,3,4]",
							vec: "<1,0,1,1,0,0>",
							z: null
						},
						{
							number: "3-4A",
							primeForm: "[0,1,5]",
							vec: "<1,0,0,1,1,0>",
							z: null
						},
						{
							number: "3-4B",
							primeForm: "[0,4,5]",
							vec: "<1,0,0,1,1,0>",
							z: null
						},
						{
							number: "3-5A",
							primeForm: "[0,1,6]",
							vec: "<1,0,0,0,1,1>",
							z: null
						},
						{
							number: "3-5B",
							primeForm: "[0,5,6]",
							vec: "<1,0,0,0,1,1>",
							z: null
						},
						{
							number: "3-6",
							primeForm: "[0,2,4]",
							vec: "<0,2,0,1,0,0>",
							z: null
						},
						{
							number: "3-7A",
							primeForm: "[0,2,5]",
							vec: "<0,1,1,0,1,0>",
							z: null
						},
						{
							number: "3-7B",
							primeForm: "[0,3,5]",
							vec: "<0,1,1,0,1,0>",
							z: null
						},
						{
							number: "3-8A",
							primeForm: "[0,2,6]",
							vec: "<0,1,0,1,0,1>",
							z: null
						},
						{
							number: "3-8B",
							primeForm: "[0,4,6]",
							vec: "<0,1,0,1,0,1>",
							z: null
						},
						{
							number: "3-9",
							primeForm: "[0,2,7]",
							vec: "<0,1,0,0,2,0>",
							z: null
						},
						{
							number: "3-10",
							primeForm: "[0,3,6]",
							vec: "<0,0,2,0,0,1>",
							z: null
						},
						{
							number: "3-11A",
							primeForm: "[0,3,7]",
							vec: "<0,0,1,1,1,0>",
							z: null
						},
						{
							number: "3-11B",
							primeForm: "[0,4,7]",
							vec: "<0,0,1,1,1,0>",
							z: null
						},
						{
							number: "3-12",
							primeForm: "[0,4,8]",
							vec: "<0,0,0,3,0,0>",
							z: null
						},
						{
							number: "4-1",
							primeForm: "[0,1,2,3]",
							vec: "<3,2,1,0,0,0>",
							z: null
						},
						{
							number: "4-2A",
							primeForm: "[0,1,2,4]",
							vec: "<2,2,1,1,0,0>",
							z: null
						},
						{
							number: "4-2B",
							primeForm: "[0,2,3,4]",
							vec: "<2,2,1,1,0,0>",
							z: null
						},
						{
							number: "4-3",
							primeForm: "[0,1,3,4]",
							vec: "<2,1,2,1,0,0>",
							z: null
						},
						{
							number: "4-4A",
							primeForm: "[0,1,2,5]",
							vec: "<2,1,1,1,1,0>",
							z: null
						},
						{
							number: "4-4B",
							primeForm: "[0,3,4,5]",
							vec: "<2,1,1,1,1,0>",
							z: null
						},
						{
							number: "4-5A",
							primeForm: "[0,1,2,6]",
							vec: "<2,1,0,1,1,1>",
							z: null
						},
						{
							number: "4-5B",
							primeForm: "[0,4,5,6]",
							vec: "<2,1,0,1,1,1>",
							z: null
						},
						{
							number: "4-6",
							primeForm: "[0,1,2,7]",
							vec: "<2,1,0,0,2,1>",
							z: null
						},
						{
							number: "4-7",
							primeForm: "[0,1,4,5]",
							vec: "<2,0,1,2,1,0>",
							z: null
						},
						{
							number: "4-8",
							primeForm: "[0,1,5,6]",
							vec: "<2,0,0,1,2,1>",
							z: null
						},
						{
							number: "4-9",
							primeForm: "[0,1,6,7]",
							vec: "<2,0,0,0,2,2>",
							z: null
						},
						{
							number: "4-10",
							primeForm: "[0,2,3,5]",
							vec: "<1,2,2,0,1,0>",
							z: null
						},
						{
							number: "4-11A",
							primeForm: "[0,1,3,5]",
							vec: "<1,2,1,1,1,0>",
							z: null
						},
						{
							number: "4-11B",
							primeForm: "[0,2,4,5]",
							vec: "<1,2,1,1,1,0>",
							z: null
						},
						{
							number: "4-12A",
							primeForm: "[0,2,3,6]",
							vec: "<1,1,2,1,0,1>",
							z: null
						},
						{
							number: "4-12B",
							primeForm: "[0,3,4,6]",
							vec: "<1,1,2,1,0,1>",
							z: null
						},
						{
							number: "4-13A",
							primeForm: "[0,1,3,6]",
							vec: "<1,1,2,0,1,1>",
							z: null
						},
						{
							number: "4-13B",
							primeForm: "[0,3,5,6]",
							vec: "<1,1,2,0,1,1>",
							z: null
						},
						{
							number: "4-14A",
							primeForm: "[0,2,3,7]",
							vec: "<1,1,1,1,2,0>",
							z: null
						},
						{
							number: "4-14B",
							primeForm: "[0,4,5,7]",
							vec: "<1,1,1,1,2,0>",
							z: null
						},
						{
							number: "4-16A",
							primeForm: "[0,1,5,7]",
							vec: "<1,1,0,1,2,1>",
							z: null
						},
						{
							number: "4-16B",
							primeForm: "[0,2,6,7]",
							vec: "<1,1,0,1,2,1>",
							z: null
						},
						{
							number: "4-17",
							primeForm: "[0,3,4,7]",
							vec: "<1,0,2,2,1,0>",
							z: null
						},
						{
							number: "4-18A",
							primeForm: "[0,1,4,7]",
							vec: "<1,0,2,1,1,1>",
							z: null
						},
						{
							number: "4-18B",
							primeForm: "[0,3,6,7]",
							vec: "<1,0,2,1,1,1>",
							z: null
						},
						{
							number: "4-19A",
							primeForm: "[0,1,4,8]",
							vec: "<1,0,1,3,1,0>",
							z: null
						},
						{
							number: "4-19B",
							primeForm: "[0,3,4,8]",
							vec: "<1,0,1,3,1,0>",
							z: null
						},
						{
							number: "4-20",
							primeForm: "[0,1,5,8]",
							vec: "<1,0,1,2,2,0>",
							z: null
						},
						{
							number: "4-21",
							primeForm: "[0,2,4,6]",
							vec: "<0,3,0,2,0,1>",
							z: null
						},
						{
							number: "4-22A",
							primeForm: "[0,2,4,7]",
							vec: "<0,2,1,1,2,0>",
							z: null
						},
						{
							number: "4-22B",
							primeForm: "[0,3,5,7]",
							vec: "<0,2,1,1,2,0>",
							z: null
						},
						{
							number: "4-23",
							primeForm: "[0,2,5,7]",
							vec: "<0,2,1,0,3,0>",
							z: null
						},
						{
							number: "4-24",
							primeForm: "[0,2,4,8]",
							vec: "<0,2,0,3,0,1>",
							z: null
						},
						{
							number: "4-25",
							primeForm: "[0,2,6,8]",
							vec: "<0,2,0,2,0,2>",
							z: null
						},
						{
							number: "4-26",
							primeForm: "[0,3,5,8]",
							vec: "<0,1,2,1,2,0>",
							z: null
						},
						{
							number: "4-27A",
							primeForm: "[0,2,5,8]",
							vec: "<0,1,2,1,1,1>",
							z: null
						},
						{
							number: "4-27B",
							primeForm: "[0,3,6,8]",
							vec: "<0,1,2,1,1,1>",
							z: null
						},
						{
							number: "4-28",
							primeForm: "[0,3,6,9]",
							vec: "<0,0,4,0,0,2>",
							z: null
						},
						{
							number: "5-1",
							primeForm: "[0,1,2,3,4]",
							vec: "<4,3,2,1,0,0>",
							z: null
						},
						{
							number: "5-2A",
							primeForm: "[0,1,2,3,5]",
							vec: "<3,3,2,1,1,0>",
							z: null
						},
						{
							number: "5-2B",
							primeForm: "[0,2,3,4,5]",
							vec: "<3,3,2,1,1,0>",
							z: null
						},
						{
							number: "5-3A",
							primeForm: "[0,1,2,4,5]",
							vec: "<3,2,2,2,1,0>",
							z: null
						},
						{
							number: "5-3B",
							primeForm: "[0,1,3,4,5]",
							vec: "<3,2,2,2,1,0>",
							z: null
						},
						{
							number: "5-4A",
							primeForm: "[0,1,2,3,6]",
							vec: "<3,2,2,1,1,1>",
							z: null
						},
						{
							number: "5-4B",
							primeForm: "[0,3,4,5,6]",
							vec: "<3,2,2,1,1,1>",
							z: null
						},
						{
							number: "5-5A",
							primeForm: "[0,1,2,3,7]",
							vec: "<3,2,1,1,2,1>",
							z: null
						},
						{
							number: "5-5B",
							primeForm: "[0,4,5,6,7]",
							vec: "<3,2,1,1,2,1>",
							z: null
						},
						{
							number: "5-6A",
							primeForm: "[0,1,2,5,6]",
							vec: "<3,1,1,2,2,1>",
							z: null
						},
						{
							number: "5-6B",
							primeForm: "[0,1,4,5,6]",
							vec: "<3,1,1,2,2,1>",
							z: null
						},
						{
							number: "5-7A",
							primeForm: "[0,1,2,6,7]",
							vec: "<3,1,0,1,3,2>",
							z: null
						},
						{
							number: "5-7B",
							primeForm: "[0,1,5,6,7]",
							vec: "<3,1,0,1,3,2>",
							z: null
						},
						{
							number: "5-8",
							primeForm: "[0,2,3,4,6]",
							vec: "<2,3,2,2,0,1>",
							z: null
						},
						{
							number: "5-9A",
							primeForm: "[0,1,2,4,6]",
							vec: "<2,3,1,2,1,1>",
							z: null
						},
						{
							number: "5-9B",
							primeForm: "[0,2,4,5,6]",
							vec: "<2,3,1,2,1,1>",
							z: null
						},
						{
							number: "5-10A",
							primeForm: "[0,1,3,4,6]",
							vec: "<2,2,3,1,1,1>",
							z: null
						},
						{
							number: "5-10B",
							primeForm: "[0,2,3,5,6]",
							vec: "<2,2,3,1,1,1>",
							z: null
						},
						{
							number: "5-11A",
							primeForm: "[0,2,3,4,7]",
							vec: "<2,2,2,2,2,0>",
							z: null
						},
						{
							number: "5-11B",
							primeForm: "[0,3,4,5,7]",
							vec: "<2,2,2,2,2,0>",
							z: null
						},
						{
							number: "5-13A",
							primeForm: "[0,1,2,4,8]",
							vec: "<2,2,1,3,1,1>",
							z: null
						},
						{
							number: "5-13B",
							primeForm: "[0,2,3,4,8]",
							vec: "<2,2,1,3,1,1>",
							z: null
						},
						{
							number: "5-14A",
							primeForm: "[0,1,2,5,7]",
							vec: "<2,2,1,1,3,1>",
							z: null
						},
						{
							number: "5-14B",
							primeForm: "[0,2,5,6,7]",
							vec: "<2,2,1,1,3,1>",
							z: null
						},
						{
							number: "5-15",
							primeForm: "[0,1,2,6,8]",
							vec: "<2,2,0,2,2,2>",
							z: null
						},
						{
							number: "5-16A",
							primeForm: "[0,1,3,4,7]",
							vec: "<2,1,3,2,1,1>",
							z: null
						},
						{
							number: "5-16B",
							primeForm: "[0,3,4,6,7]",
							vec: "<2,1,3,2,1,1>",
							z: null
						},
						{
							number: "5-19A",
							primeForm: "[0,1,3,6,7]",
							vec: "<2,1,2,1,2,2>",
							z: null
						},
						{
							number: "5-19B",
							primeForm: "[0,1,4,6,7]",
							vec: "<2,1,2,1,2,2>",
							z: null
						},
						{
							number: "5-20A",
							primeForm: "[0,1,5,6,8]",
							vec: "<2,1,1,2,3,1>",
							z: null
						},
						{
							number: "5-20B",
							primeForm: "[0,2,3,7,8]",
							vec: "<2,1,1,2,3,1>",
							z: null
						},
						{
							number: "5-21A",
							primeForm: "[0,1,4,5,8]",
							vec: "<2,0,2,4,2,0>",
							z: null
						},
						{
							number: "5-21B",
							primeForm: "[0,3,4,7,8]",
							vec: "<2,0,2,4,2,0>",
							z: null
						},
						{
							number: "5-22",
							primeForm: "[0,1,4,7,8]",
							vec: "<2,0,2,3,2,1>",
							z: null
						},
						{
							number: "5-23A",
							primeForm: "[0,2,3,5,7]",
							vec: "<1,3,2,1,3,0>",
							z: null
						},
						{
							number: "5-23B",
							primeForm: "[0,2,4,5,7]",
							vec: "<1,3,2,1,3,0>",
							z: null
						},
						{
							number: "5-24A",
							primeForm: "[0,1,3,5,7]",
							vec: "<1,3,1,2,2,1>",
							z: null
						},
						{
							number: "5-24B",
							primeForm: "[0,2,4,6,7]",
							vec: "<1,3,1,2,2,1>",
							z: null
						},
						{
							number: "5-25A",
							primeForm: "[0,2,3,5,8]",
							vec: "<1,2,3,1,2,1>",
							z: null
						},
						{
							number: "5-25B",
							primeForm: "[0,3,5,6,8]",
							vec: "<1,2,3,1,2,1>",
							z: null
						},
						{
							number: "5-26A",
							primeForm: "[0,2,4,5,8]",
							vec: "<1,2,2,3,1,1>",
							z: null
						},
						{
							number: "5-26B",
							primeForm: "[0,3,4,6,8]",
							vec: "<1,2,2,3,1,1>",
							z: null
						},
						{
							number: "5-27A",
							primeForm: "[0,1,3,5,8]",
							vec: "<1,2,2,2,3,0>",
							z: null
						},
						{
							number: "5-27B",
							primeForm: "[0,3,5,7,8]",
							vec: "<1,2,2,2,3,0>",
							z: null
						},
						{
							number: "5-28A",
							primeForm: "[0,2,3,6,8]",
							vec: "<1,2,2,2,1,2>",
							z: null
						},
						{
							number: "5-28B",
							primeForm: "[0,2,5,6,8]",
							vec: "<1,2,2,2,1,2>",
							z: null
						},
						{
							number: "5-29A",
							primeForm: "[0,1,3,6,8]",
							vec: "<1,2,2,1,3,1>",
							z: null
						},
						{
							number: "5-29B",
							primeForm: "[0,2,5,7,8]",
							vec: "<1,2,2,1,3,1>",
							z: null
						},
						{
							number: "5-30A",
							primeForm: "[0,1,4,6,8]",
							vec: "<1,2,1,3,2,1>",
							z: null
						},
						{
							number: "5-30B",
							primeForm: "[0,2,4,7,8]",
							vec: "<1,2,1,3,2,1>",
							z: null
						},
						{
							number: "5-31A",
							primeForm: "[0,1,3,6,9]",
							vec: "<1,1,4,1,1,2>",
							z: null
						},
						{
							number: "5-31B",
							primeForm: "[0,2,3,6,9]",
							vec: "<1,1,4,1,1,2>",
							z: null
						},
						{
							number: "5-32A",
							primeForm: "[0,1,4,6,9]",
							vec: "<1,1,3,2,2,1>",
							z: null
						},
						{
							number: "5-32B",
							primeForm: "[0,2,5,6,9]",
							vec: "<1,1,3,2,2,1>",
							z: null
						},
						{
							number: "5-33",
							primeForm: "[0,2,4,6,8]",
							vec: "<0,4,0,4,0,2>",
							z: null
						},
						{
							number: "5-34",
							primeForm: "[0,2,4,6,9]",
							vec: "<0,3,2,2,2,1>",
							z: null
						},
						{
							number: "5-35",
							primeForm: "[0,2,4,7,9]",
							vec: "<0,3,2,1,4,0>",
							z: null
						},
						{
							number: "6-1",
							primeForm: "[0,1,2,3,4,5]",
							vec: "<5,4,3,2,1,0>",
							z: null
						},
						{
							number: "6-2A",
							primeForm: "[0,1,2,3,4,6]",
							vec: "<4,4,3,2,1,1>",
							z: null
						},
						{
							number: "6-2B",
							primeForm: "[0,2,3,4,5,6]",
							vec: "<4,4,3,2,1,1>",
							z: null
						},
						{
							number: "6-5A",
							primeForm: "[0,1,2,3,6,7]",
							vec: "<4,2,2,2,3,2>",
							z: null
						},
						{
							number: "6-5B",
							primeForm: "[0,1,4,5,6,7]",
							vec: "<4,2,2,2,3,2>",
							z: null
						},
						{
							number: "6-7",
							primeForm: "[0,1,2,6,7,8]",
							vec: "<4,2,0,2,4,3>",
							z: null
						},
						{
							number: "6-8",
							primeForm: "[0,2,3,4,5,7]",
							vec: "<3,4,3,2,3,0>",
							z: null
						},
						{
							number: "6-9A",
							primeForm: "[0,1,2,3,5,7]",
							vec: "<3,4,2,2,3,1>",
							z: null
						},
						{
							number: "6-9B",
							primeForm: "[0,2,4,5,6,7]",
							vec: "<3,4,2,2,3,1>",
							z: null
						},
						{
							number: "6-14A",
							primeForm: "[0,1,3,4,5,8]",
							vec: "<3,2,3,4,3,0>",
							z: null
						},
						{
							number: "6-14B",
							primeForm: "[0,3,4,5,7,8]",
							vec: "<3,2,3,4,3,0>",
							z: null
						},
						{
							number: "6-15A",
							primeForm: "[0,1,2,4,5,8]",
							vec: "<3,2,3,4,2,1>",
							z: null
						},
						{
							number: "6-15B",
							primeForm: "[0,3,4,6,7,8]",
							vec: "<3,2,3,4,2,1>",
							z: null
						},
						{
							number: "6-16A",
							primeForm: "[0,1,4,5,6,8]",
							vec: "<3,2,2,4,3,1>",
							z: null
						},
						{
							number: "6-16B",
							primeForm: "[0,2,3,4,7,8]",
							vec: "<3,2,2,4,3,1>",
							z: null
						},
						{
							number: "6-18A",
							primeForm: "[0,1,2,5,7,8]",
							vec: "<3,2,2,2,4,2>",
							z: null
						},
						{
							number: "6-18B",
							primeForm: "[0,1,3,6,7,8]",
							vec: "<3,2,2,2,4,2>",
							z: null
						},
						{
							number: "6-20",
							primeForm: "[0,1,4,5,8,9]",
							vec: "<3,0,3,6,3,0>",
							z: null
						},
						{
							number: "6-21A",
							primeForm: "[0,2,3,4,6,8]",
							vec: "<2,4,2,4,1,2>",
							z: null
						},
						{
							number: "6-21B",
							primeForm: "[0,2,4,5,6,8]",
							vec: "<2,4,2,4,1,2>",
							z: null
						},
						{
							number: "6-22A",
							primeForm: "[0,1,2,4,6,8]",
							vec: "<2,4,1,4,2,2>",
							z: null
						},
						{
							number: "6-22B",
							primeForm: "[0,2,4,6,7,8]",
							vec: "<2,4,1,4,2,2>",
							z: null
						},
						{
							number: "6-27A",
							primeForm: "[0,1,3,4,6,9]",
							vec: "<2,2,5,2,2,2>",
							z: null
						},
						{
							number: "6-27B",
							primeForm: "[0,2,3,5,6,9]",
							vec: "<2,2,5,2,2,2>",
							z: null
						},
						{
							number: "6-30A",
							primeForm: "[0,1,3,6,7,9]",
							vec: "<2,2,4,2,2,3>",
							z: null
						},
						{
							number: "6-30B",
							primeForm: "[0,2,3,6,8,9]",
							vec: "<2,2,4,2,2,3>",
							z: null
						},
						{
							number: "6-31A",
							primeForm: "[0,1,4,5,7,9]",
							vec: "<2,2,3,4,3,1>",
							z: null
						},
						{
							number: "6-31B",
							primeForm: "[0,2,4,5,8,9]",
							vec: "<2,2,3,4,3,1>",
							z: null
						},
						{
							number: "6-32",
							primeForm: "[0,2,4,5,7,9]",
							vec: "<1,4,3,2,5,0>",
							z: null
						},
						{
							number: "6-33A",
							primeForm: "[0,2,3,5,7,9]",
							vec: "<1,4,3,2,4,1>",
							z: null
						},
						{
							number: "6-33B",
							primeForm: "[0,2,4,6,7,9]",
							vec: "<1,4,3,2,4,1>",
							z: null
						},
						{
							number: "6-34A",
							primeForm: "[0,1,3,5,7,9]",
							vec: "<1,4,2,4,2,2>",
							z: null
						},
						{
							number: "6-34B",
							primeForm: "[0,2,4,6,8,9]",
							vec: "<1,4,2,4,2,2>",
							z: null
						},
						{
							number: "6-35",
							primeForm: "[0,2,4,6,8,T]",
							vec: "<0,6,0,6,0,3>",
							z: null
						},
						{
							number: "7-1",
							primeForm: "[0,1,2,3,4,5,6]",
							vec: "<6,5,4,3,2,1>",
							z: null
						},
						{
							number: "7-2A",
							primeForm: "[0,1,2,3,4,5,7]",
							vec: "<5,5,4,3,3,1>",
							z: null
						},
						{
							number: "7-2B",
							primeForm: "[0,2,3,4,5,6,7]",
							vec: "<5,5,4,3,3,1>",
							z: null
						},
						{
							number: "7-3A",
							primeForm: "[0,1,2,3,4,5,8]",
							vec: "<5,4,4,4,3,1>",
							z: null
						},
						{
							number: "7-3B",
							primeForm: "[0,3,4,5,6,7,8]",
							vec: "<5,4,4,4,3,1>",
							z: null
						},
						{
							number: "7-4A",
							primeForm: "[0,1,2,3,4,6,7]",
							vec: "<5,4,4,3,3,2>",
							z: null
						},
						{
							number: "7-4B",
							primeForm: "[0,1,3,4,5,6,7]",
							vec: "<5,4,4,3,3,2>",
							z: null
						},
						{
							number: "7-5A",
							primeForm: "[0,1,2,3,5,6,7]",
							vec: "<5,4,3,3,4,2>",
							z: null
						},
						{
							number: "7-5B",
							primeForm: "[0,1,2,4,5,6,7]",
							vec: "<5,4,3,3,4,2>",
							z: null
						},
						{
							number: "7-6A",
							primeForm: "[0,1,2,3,4,7,8]",
							vec: "<5,3,3,4,4,2>",
							z: null
						},
						{
							number: "7-6B",
							primeForm: "[0,1,4,5,6,7,8]",
							vec: "<5,3,3,4,4,2>",
							z: null
						},
						{
							number: "7-7A",
							primeForm: "[0,1,2,3,6,7,8]",
							vec: "<5,3,2,3,5,3>",
							z: null
						},
						{
							number: "7-7B",
							primeForm: "[0,1,2,5,6,7,8]",
							vec: "<5,3,2,3,5,3>",
							z: null
						},
						{
							number: "7-8",
							primeForm: "[0,2,3,4,5,6,8]",
							vec: "<4,5,4,4,2,2>",
							z: null
						},
						{
							number: "7-9A",
							primeForm: "[0,1,2,3,4,6,8]",
							vec: "<4,5,3,4,3,2>",
							z: null
						},
						{
							number: "7-9B",
							primeForm: "[0,2,4,5,6,7,8]",
							vec: "<4,5,3,4,3,2>",
							z: null
						},
						{
							number: "7-10A",
							primeForm: "[0,1,2,3,4,6,9]",
							vec: "<4,4,5,3,3,2>",
							z: null
						},
						{
							number: "7-10B",
							primeForm: "[0,2,3,4,5,6,9]",
							vec: "<4,4,5,3,3,2>",
							z: null
						},
						{
							number: "7-11A",
							primeForm: "[0,1,3,4,5,6,8]",
							vec: "<4,4,4,4,4,1>",
							z: null
						},
						{
							number: "7-11B",
							primeForm: "[0,2,3,4,5,7,8]",
							vec: "<4,4,4,4,4,1>",
							z: null
						},
						{
							number: "7-13A",
							primeForm: "[0,1,2,4,5,6,8]",
							vec: "<4,4,3,5,3,2>",
							z: null
						},
						{
							number: "7-13B",
							primeForm: "[0,2,3,4,6,7,8]",
							vec: "<4,4,3,5,3,2>",
							z: null
						},
						{
							number: "7-14A",
							primeForm: "[0,1,2,3,5,7,8]",
							vec: "<4,4,3,3,5,2>",
							z: null
						},
						{
							number: "7-14B",
							primeForm: "[0,1,3,5,6,7,8]",
							vec: "<4,4,3,3,5,2>",
							z: null
						},
						{
							number: "7-15",
							primeForm: "[0,1,2,4,6,7,8]",
							vec: "<4,4,2,4,4,3>",
							z: null
						},
						{
							number: "7-16A",
							primeForm: "[0,1,2,3,5,6,9]",
							vec: "<4,3,5,4,3,2>",
							z: null
						},
						{
							number: "7-16B",
							primeForm: "[0,1,3,4,5,6,9]",
							vec: "<4,3,5,4,3,2>",
							z: null
						},
						{
							number: "7-19A",
							primeForm: "[0,1,2,3,6,7,9]",
							vec: "<4,3,4,3,4,3>",
							z: null
						},
						{
							number: "7-19B",
							primeForm: "[0,1,2,3,6,8,9]",
							vec: "<4,3,4,3,4,3>",
							z: null
						},
						{
							number: "7-20A",
							primeForm: "[0,1,2,5,6,7,9]",
							vec: "<4,3,3,4,5,2>",
							z: null
						},
						{
							number: "7-20B",
							primeForm: "[0,2,3,4,7,8,9]",
							vec: "<4,3,3,4,5,2>",
							z: null
						},
						{
							number: "7-21A",
							primeForm: "[0,1,2,4,5,8,9]",
							vec: "<4,2,4,6,4,1>",
							z: null
						},
						{
							number: "7-21B",
							primeForm: "[0,1,3,4,5,8,9]",
							vec: "<4,2,4,6,4,1>",
							z: null
						},
						{
							number: "7-22",
							primeForm: "[0,1,2,5,6,8,9]",
							vec: "<4,2,4,5,4,2>",
							z: null
						},
						{
							number: "7-23A",
							primeForm: "[0,2,3,4,5,7,9]",
							vec: "<3,5,4,3,5,1>",
							z: null
						},
						{
							number: "7-23B",
							primeForm: "[0,2,4,5,6,7,9]",
							vec: "<3,5,4,3,5,1>",
							z: null
						},
						{
							number: "7-24A",
							primeForm: "[0,1,2,3,5,7,9]",
							vec: "<3,5,3,4,4,2>",
							z: null
						},
						{
							number: "7-24B",
							primeForm: "[0,2,4,6,7,8,9]",
							vec: "<3,5,3,4,4,2>",
							z: null
						},
						{
							number: "7-25A",
							primeForm: "[0,2,3,4,6,7,9]",
							vec: "<3,4,5,3,4,2>",
							z: null
						},
						{
							number: "7-25B",
							primeForm: "[0,2,3,5,6,7,9]",
							vec: "<3,4,5,3,4,2>",
							z: null
						},
						{
							number: "7-26A",
							primeForm: "[0,1,3,4,5,7,9]",
							vec: "<3,4,4,5,3,2>",
							z: null
						},
						{
							number: "7-26B",
							primeForm: "[0,2,4,5,6,8,9]",
							vec: "<3,4,4,5,3,2>",
							z: null
						},
						{
							number: "7-27A",
							primeForm: "[0,1,2,4,5,7,9]",
							vec: "<3,4,4,4,5,1>",
							z: null
						},
						{
							number: "7-27B",
							primeForm: "[0,2,4,5,7,8,9]",
							vec: "<3,4,4,4,5,1>",
							z: null
						},
						{
							number: "7-28A",
							primeForm: "[0,1,3,5,6,7,9]",
							vec: "<3,4,4,4,3,3>",
							z: null
						},
						{
							number: "7-28B",
							primeForm: "[0,2,3,4,6,8,9]",
							vec: "<3,4,4,4,3,3>",
							z: null
						},
						{
							number: "7-29A",
							primeForm: "[0,1,2,4,6,7,9]",
							vec: "<3,4,4,3,5,2>",
							z: null
						},
						{
							number: "7-29B",
							primeForm: "[0,2,3,5,7,8,9]",
							vec: "<3,4,4,3,5,2>",
							z: null
						},
						{
							number: "7-30A",
							primeForm: "[0,1,2,4,6,8,9]",
							vec: "<3,4,3,5,4,2>",
							z: null
						},
						{
							number: "7-30B",
							primeForm: "[0,1,3,5,7,8,9]",
							vec: "<3,4,3,5,4,2>",
							z: null
						},
						{
							number: "7-31A",
							primeForm: "[0,1,3,4,6,7,9]",
							vec: "<3,3,6,3,3,3>",
							z: null
						},
						{
							number: "7-31B",
							primeForm: "[0,2,3,5,6,8,9]",
							vec: "<3,3,6,3,3,3>",
							z: null
						},
						{
							number: "7-32A",
							primeForm: "[0,1,3,4,6,8,9]",
							vec: "<3,3,5,4,4,2>",
							z: null
						},
						{
							number: "7-32B",
							primeForm: "[0,1,3,5,6,8,9]",
							vec: "<3,3,5,4,4,2>",
							z: null
						},
						{
							number: "7-33",
							primeForm: "[0,1,2,4,6,8,T]",
							vec: "<2,6,2,6,2,3>",
							z: null
						},
						{
							number: "7-34",
							primeForm: "[0,1,3,4,6,8,T]",
							vec: "<2,5,4,4,4,2>",
							z: null
						},
						{
							number: "7-35",
							primeForm: "[0,1,3,5,6,8,T]",
							vec: "<2,5,4,3,6,1>",
							z: null
						},
						{
							number: "8-1",
							primeForm: "[0,1,2,3,4,5,6,7]",
							vec: "<7,6,5,4,4,2>",
							z: null
						},
						{
							number: "8-2A",
							primeForm: "[0,1,2,3,4,5,6,8]",
							vec: "<6,6,5,5,4,2>",
							z: null
						},
						{
							number: "8-2B",
							primeForm: "[0,2,3,4,5,6,7,8]",
							vec: "<6,6,5,5,4,2>",
							z: null
						},
						{
							number: "8-3",
							primeForm: "[0,1,2,3,4,5,6,9]",
							vec: "<6,5,6,5,4,2>",
							z: null
						},
						{
							number: "8-4A",
							primeForm: "[0,1,2,3,4,5,7,8]",
							vec: "<6,5,5,5,5,2>",
							z: null
						},
						{
							number: "8-4B",
							primeForm: "[0,1,3,4,5,6,7,8]",
							vec: "<6,5,5,5,5,2>",
							z: null
						},
						{
							number: "8-5A",
							primeForm: "[0,1,2,3,4,6,7,8]",
							vec: "<6,5,4,5,5,3>",
							z: null
						},
						{
							number: "8-5B",
							primeForm: "[0,1,2,4,5,6,7,8]",
							vec: "<6,5,4,5,5,3>",
							z: null
						},
						{
							number: "8-6",
							primeForm: "[0,1,2,3,5,6,7,8]",
							vec: "<6,5,4,4,6,3>",
							z: null
						},
						{
							number: "8-7",
							primeForm: "[0,1,2,3,4,5,8,9]",
							vec: "<6,4,5,6,5,2>",
							z: null
						},
						{
							number: "8-8",
							primeForm: "[0,1,2,3,4,7,8,9]",
							vec: "<6,4,4,5,6,3>",
							z: null
						},
						{
							number: "8-9",
							primeForm: "[0,1,2,3,6,7,8,9]",
							vec: "<6,4,4,4,6,4>",
							z: null
						},
						{
							number: "8-10",
							primeForm: "[0,2,3,4,5,6,7,9]",
							vec: "<5,6,6,4,5,2>",
							z: null
						},
						{
							number: "8-11A",
							primeForm: "[0,1,2,3,4,5,7,9]",
							vec: "<5,6,5,5,5,2>",
							z: null
						},
						{
							number: "8-11B",
							primeForm: "[0,2,4,5,6,7,8,9]",
							vec: "<5,6,5,5,5,2>",
							z: null
						},
						{
							number: "8-12A",
							primeForm: "[0,1,3,4,5,6,7,9]",
							vec: "<5,5,6,5,4,3>",
							z: null
						},
						{
							number: "8-12B",
							primeForm: "[0,2,3,4,5,6,8,9]",
							vec: "<5,5,6,5,4,3>",
							z: null
						},
						{
							number: "8-13A",
							primeForm: "[0,1,2,3,4,6,7,9]",
							vec: "<5,5,6,4,5,3>",
							z: null
						},
						{
							number: "8-13B",
							primeForm: "[0,2,3,5,6,7,8,9]",
							vec: "<5,5,6,4,5,3>",
							z: null
						},
						{
							number: "8-14A",
							primeForm: "[0,1,2,4,5,6,7,9]",
							vec: "<5,5,5,5,6,2>",
							z: null
						},
						{
							number: "8-14B",
							primeForm: "[0,2,3,4,5,7,8,9]",
							vec: "<5,5,5,5,6,2>",
							z: null
						},
						{
							number: "8-16A",
							primeForm: "[0,1,2,3,5,7,8,9]",
							vec: "<5,5,4,5,6,3>",
							z: null
						},
						{
							number: "8-16B",
							primeForm: "[0,1,2,4,6,7,8,9]",
							vec: "<5,5,4,5,6,3>",
							z: null
						},
						{
							number: "8-17",
							primeForm: "[0,1,3,4,5,6,8,9]",
							vec: "<5,4,6,6,5,2>",
							z: null
						},
						{
							number: "8-18A",
							primeForm: "[0,1,2,3,5,6,8,9]",
							vec: "<5,4,6,5,5,3>",
							z: null
						},
						{
							number: "8-18B",
							primeForm: "[0,1,3,4,6,7,8,9]",
							vec: "<5,4,6,5,5,3>",
							z: null
						},
						{
							number: "8-19A",
							primeForm: "[0,1,2,4,5,6,8,9]",
							vec: "<5,4,5,7,5,2>",
							z: null
						},
						{
							number: "8-19B",
							primeForm: "[0,1,3,4,5,7,8,9]",
							vec: "<5,4,5,7,5,2>",
							z: null
						},
						{
							number: "8-20",
							primeForm: "[0,1,2,4,5,7,8,9]",
							vec: "<5,4,5,6,6,2>",
							z: null
						},
						{
							number: "8-21",
							primeForm: "[0,1,2,3,4,6,8,T]",
							vec: "<4,7,4,6,4,3>",
							z: null
						},
						{
							number: "8-22A",
							primeForm: "[0,1,2,3,5,6,8,T]",
							vec: "<4,6,5,5,6,2>",
							z: null
						},
						{
							number: "8-22B",
							primeForm: "[0,1,3,4,5,6,8,T]",
							vec: "<4,6,5,5,6,2>",
							z: null
						},
						{
							number: "8-23",
							primeForm: "[0,1,2,3,5,7,8,T]",
							vec: "<4,6,5,4,7,2>",
							z: null
						},
						{
							number: "8-24",
							primeForm: "[0,1,2,4,5,6,8,T]",
							vec: "<4,6,4,7,4,3>",
							z: null
						},
						{
							number: "8-25",
							primeForm: "[0,1,2,4,6,7,8,T]",
							vec: "<4,6,4,6,4,4>",
							z: null
						},
						{
							number: "8-26",
							primeForm: "[0,1,3,4,5,7,8,T]",
							vec: "<4,5,6,5,6,2>",
							z: null
						},
						{
							number: "8-27A",
							primeForm: "[0,1,2,4,5,7,8,T]",
							vec: "<4,5,6,5,5,3>",
							z: null
						},
						{
							number: "8-27B",
							primeForm: "[0,1,3,4,6,7,8,T]",
							vec: "<4,5,6,5,5,3>",
							z: null
						},
						{
							number: "8-28",
							primeForm: "[0,1,3,4,6,7,9,T]",
							vec: "<4,4,8,4,4,4>",
							z: null
						},
						{
							number: "9-1",
							primeForm: "[0,1,2,3,4,5,6,7,8]",
							vec: "<8,7,6,6,6,3>",
							z: null
						},
						{
							number: "9-2A",
							primeForm: "[0,1,2,3,4,5,6,7,9]",
							vec: "<7,7,7,6,6,3>",
							z: null
						},
						{
							number: "9-2B",
							primeForm: "[0,2,3,4,5,6,7,8,9]",
							vec: "<7,7,7,6,6,3>",
							z: null
						},
						{
							number: "9-3A",
							primeForm: "[0,1,2,3,4,5,6,8,9]",
							vec: "<7,6,7,7,6,3>",
							z: null
						},
						{
							number: "9-3B",
							primeForm: "[0,1,3,4,5,6,7,8,9]",
							vec: "<7,6,7,7,6,3>",
							z: null
						},
						{
							number: "9-4A",
							primeForm: "[0,1,2,3,4,5,7,8,9]",
							vec: "<7,6,6,7,7,3>",
							z: null
						},
						{
							number: "9-4B",
							primeForm: "[0,1,2,4,5,6,7,8,9]",
							vec: "<7,6,6,7,7,3>",
							z: null
						},
						{
							number: "9-5A",
							primeForm: "[0,1,2,3,4,6,7,8,9]",
							vec: "<7,6,6,6,7,4>",
							z: null
						},
						{
							number: "9-5B",
							primeForm: "[0,1,2,3,5,6,7,8,9]",
							vec: "<7,6,6,6,7,4>",
							z: null
						},
						{
							number: "9-6",
							primeForm: "[0,1,2,3,4,5,6,8,T]",
							vec: "<6,8,6,7,6,3>",
							z: null
						},
						{
							number: "9-7A",
							primeForm: "[0,1,2,3,4,5,7,8,T]",
							vec: "<6,7,7,6,7,3>",
							z: null
						},
						{
							number: "9-7B",
							primeForm: "[0,1,3,4,5,6,7,8,T]",
							vec: "<6,7,7,6,7,3>",
							z: null
						},
						{
							number: "9-8A",
							primeForm: "[0,1,2,3,4,6,7,8,T]",
							vec: "<6,7,6,7,6,4>",
							z: null
						},
						{
							number: "9-8B",
							primeForm: "[0,1,2,4,5,6,7,8,T]",
							vec: "<6,7,6,7,6,4>",
							z: null
						},
						{
							number: "9-9",
							primeForm: "[0,1,2,3,5,6,7,8,T]",
							vec: "<6,7,6,6,8,3>",
							z: null
						},
						{
							number: "9-10",
							primeForm: "[0,1,2,3,4,6,7,9,T]",
							vec: "<6,6,8,6,6,4>",
							z: null
						},
						{
							number: "9-11A",
							primeForm: "[0,1,2,3,5,6,7,9,T]",
							vec: "<6,6,7,7,7,3>",
							z: null
						},
						{
							number: "9-11B",
							primeForm: "[0,1,2,4,5,6,7,9,T]",
							vec: "<6,6,7,7,7,3>",
							z: null
						},
						{
							number: "9-12",
							primeForm: "[0,1,2,4,5,6,8,9,T]",
							vec: "<6,6,6,9,6,3>",
							z: null
						},
						{
							number: "10-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9]",
							vec: "<9,8,8,8,8,4>",
							z: null
						},
						{
							number: "10-2",
							primeForm: "[0,1,2,3,4,5,6,7,8,T]",
							vec: "<8,9,8,8,8,4>",
							z: null
						},
						{
							number: "10-3",
							primeForm: "[0,1,2,3,4,5,6,7,9,T]",
							vec: "<8,8,9,8,8,4>",
							z: null
						},
						{
							number: "10-4",
							primeForm: "[0,1,2,3,4,5,6,8,9,T]",
							vec: "<8,8,8,9,8,4>",
							z: null
						},
						{
							number: "10-5",
							primeForm: "[0,1,2,3,4,5,7,8,9,T]",
							vec: "<8,8,8,8,9,4>",
							z: null
						},
						{
							number: "10-6",
							primeForm: "[0,1,2,3,4,6,7,8,9,T]",
							vec: "<8,8,8,8,8,5>",
							z: null
						},
						{
							number: "11-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9,T]",
							vec: "<T,T,T,T,T,5>",
							z: null
						},
						{
							number: "12-1",
							primeForm: "[0,1,2,3,4,5,6,7,8,9,T,E]",
							vec: "<C,C,C,C,C,6>",
							z: null
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, single exact", done => {
			chai
				.request(server)
				.get("/api/data/z/4-z15A")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "4-z29A",
							primeForm: "[0,1,3,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						},
						{
							number: "4-z29B",
							primeForm: "[0,4,6,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, single exact regex", done => {
			chai
				.request(server)
				.get("/api/data/z/^4-z29A$")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "4-z15A",
							primeForm: "[0,1,4,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						},
						{
							number: "4-z15B",
							primeForm: "[0,2,5,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, single starts with", done => {
			chai
				.request(server)
				.get("/api/data/z/^4-z")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "4-z15A",
							primeForm: "[0,1,4,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						},
						{
							number: "4-z15B",
							primeForm: "[0,2,5,6]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z29A"
						},
						{
							number: "4-z29A",
							primeForm: "[0,1,3,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						},
						{
							number: "4-z29B",
							primeForm: "[0,4,6,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						}
					]);
					res.should.have.status(200);
					done();
				});
		});

		it("should return 200 and correct data, single ends with", done => {
			chai
				.request(server)
				.get("/api/data/z/-z15A$")
				.end((err, res) => {
					should.not.exist(err);
					res.body.should.deep.equal([
						{
							number: "4-z29A",
							primeForm: "[0,1,3,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						},
						{
							number: "4-z29B",
							primeForm: "[0,4,6,7]",
							vec: "<1,1,1,1,1,1>",
							z: "4-z15A"
						},
						{
							number: "8-z29A",
							primeForm: "[0,1,2,3,5,6,7,9]",
							vec: "<5,5,5,5,5,3>",
							z: "8-z15A"
						},
						{
							number: "8-z29B",
							primeForm: "[0,2,3,4,6,7,8,9]",
							vec: "<5,5,5,5,5,3>",
							z: "8-z15A"
						}
					]);
					res.should.have.status(200);
					done();
				});
		});
	});
});
