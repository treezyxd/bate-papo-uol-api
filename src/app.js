import express from "express";
import cors from "cors";

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => `server running at port ${PORT}`);