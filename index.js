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
config();
connect();
const app = express();
app.use(cors({ ...corsOptions }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use("/schedule", scheduleRoute);
app.use("/users", usersRoute);
app.use("/admin", adminRoute);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("App is running on", port));
