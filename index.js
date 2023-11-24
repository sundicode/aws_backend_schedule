import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import scheduleRoute from "./routes/schedule.js";
import { connect } from "./utils/connectDb.js";
import usersRoute from "./routes/user.js";
import adminRoute from "./routes/admin.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { corsOptions } from "./utils/corsDomains.js";
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo";
config();
connect();
const app = express();
app.use(cors({ ...corsOptions }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
3
app.use(
  session({
    name: "user-schedule",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2_592_000_000, // 30 days
      httpOnly: process.env.NODE_ENV === "production" ? false : true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECT,
      dbName: "medicks",
    }),
  })
);

app.use("/schedule", scheduleRoute);
app.use("/users", usersRoute);
app.use("/admin", adminRoute);
app.use(errorHandler);

app.get("*", function (req, res) {
  res.status(404).json({ message: "no such route" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("App is running on", port));
