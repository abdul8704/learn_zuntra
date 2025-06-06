require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./database/connect");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");
const userRouter = require("./routes/userRouter");
const adminRoutes = require("./routes/adminRouter");
const loginRouter = require("./routes/loginRouter");
const certificateRouter = require("./routes/certificateRouter");
const common = require("./routes/common");
const cors = require("cors");
// const authRoutes = require("./router/authRoutes");

const app = express();

app.use(express.json());
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://learn-zuntra-k8ox.vercel.app",
        "https://learn-zuntra-az9i.vercel.app",
        "https://learn-zuntra-az9i-abdul-azizs-projects-d53958bd.vercel.app",
        "https://learn-zuntra-az9i-git-master-abdul-azizs-projects-d53958bd.vercel.app",
    ],
    credentials: true, // Include cookies and auth headers if needed
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use("/api/login/", loginRouter);
app.use("/api/user/", userRouter);
app.use("/api/admin/", adminRoutes);
app.use("/api/certificate/", certificateRouter);
app.use("/api/common/", common);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const start = async () => {
    const port = process.env.PORT || 3000;
    const url = process.env.MONGO_URI;

    try {
        await connectDB(url);
        console.log("Connected to database✅");
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
