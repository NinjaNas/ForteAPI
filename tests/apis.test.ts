import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/index";
const should = chai.should();

chai.use(chaiHttp);

describe("API Endpoints", () => {
	describe("GET /", () => {
		it("should return the correct text", done => {
			chai
				.request(server)
				.get("/")
				.end((err, res) => {
					should.not.exist(err);
					res.text.should.include("Hello");
					done();
				});
		});
	});
});
