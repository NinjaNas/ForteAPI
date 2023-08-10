import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});

export default app;
