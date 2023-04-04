import { fileURLToPath } from "url";
import cors from "cors";
import log4js from "log4js";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import IndexRouter from "./src/routes/index.js";
import islandRouter from "./src/routes/island.js";
import messageRouter from "./src/routes/message.js";
import membersRouter from "./src/routes/members.js";
import raidsRouter from "./src/routes/raids.js";
import FortuneRouter from "./src/routes/fortune.js";
import HistoryRouter from "./src/routes/history.js";
import MapRouter from "./src/routes/map.js";

const isDev = `${process.env.NODE_ENV}`.trim() === "development";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

log4js.configure(path.join(__dirname, isDev ? "log4js.json" : "../log4js.json"));
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");
app.use(logger(isDev ? "dev" : "common"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, isDev ? "public" : "../public")));
app.use("/api/map", MapRouter);
app.use("/api/history", HistoryRouter);
app.use("/api/island*", islandRouter);
app.use("/api/message*", messageRouter);
app.use("/api/members*", membersRouter);
app.use("/api/raid", raidsRouter);
app.use("/api/fortune", FortuneRouter);
app.use("*", IndexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
