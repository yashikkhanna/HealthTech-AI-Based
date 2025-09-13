import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRoute.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import prescriptionRouter from "./router/prescriptionRouter.js";
import DonationRouter from "./router/donationRoutes.js"
import addRouter from "./router/addRoutes.js"
const app = express();

config({ path: "./config/config.env" });

app.use(cors({
  origin: [process.env.FRONTEND_URI, process.env.DASHBOARD_URI,process.env.DOCTOR_FRONTEND_URI], // Ensure these URIs are correct
  methods: ["GET", "POST", "PUT", "DELETE"], // Ensure methods are correct
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/prescription",prescriptionRouter);
app.use("/api/v1/donation",DonationRouter);
app.use("/api/v1/addRoute" , addRouter)
dbConnection();
app.use(errorMiddleware);


export default app;
