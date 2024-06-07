import express from "express";
import cors from "cors";
import AuthRouter from "./controllers/auth-controller.js";
import morgan from "morgan";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/login", AuthRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});