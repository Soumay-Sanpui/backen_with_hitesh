import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// getting data in form of json wiht limit upto 16kb.
app.use(express.json({limit: "16kb"}))
// configuring express to get data from url as well and extented option is for the getting objects inside objects.
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import and config
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users",userRouter)

// route 1

export {app}