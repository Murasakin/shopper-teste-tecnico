import express from "express";
import router from "./router";
import cors from "cors";

const server = express();

server.use(express.json());
server.use(cors({ origin: ["http://localhost:5173"], methods: ["POST", "OPTIONS"] }));
server.use(router);

server.listen(8080, () => {
  console.log("Server running on port 8080...");
});
