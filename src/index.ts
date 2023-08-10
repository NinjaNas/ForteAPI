import dotenv from "dotenv";
import express from "express";
import fs from "fs/promises";

const app = express();
dotenv.config();

const port = process.env.PORT || 8080;

app.get("/", async (req, res) => {
	const data = await fs.readFile("./data/set_classes.json", "utf8");
	const body = JSON.parse(data);
	res.send(body);
});

// start the Express server
app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});

export default app;
