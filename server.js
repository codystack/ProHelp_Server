// require('dotenv').config();
import dot from "dotenv";
dot.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
// import http from "http";
import connect from "./database/conn.js";
import router from "./router/route.js";
// import { Server } from "socket.io";

const app = express();

// const httpServer = http.createServer(app);
// const io = new Server(httpServer, { cors: { origin: "*" } });

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // less hackers know about our stack

const port = 8080;

// socket.Socket(server, {})

/** HTTP GET Request */
app.get("/", (req, res) => {
  res.status(201).json({ message: "Welcome to ProHelp" });
});

/** api routes */
app.use("/api", router);

// io.on("connection", (socket) => {
//   console.log("Connection established");

//   getApiAndEmit(socket);
//   socket.on("disconnect", () => {
//     console.log("Disconnected");
//   });
// });

// const getApiAndEmit = (socket) => {
//   const response = "response you need";
//   socket.emit("FromAPI", response);
// };

/** start server only when we have valid connection */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection...!", error);
  });
