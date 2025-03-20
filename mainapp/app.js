const express = require("express");
const app = express();
const storage = require("../Database/mongo");
const authrouter = require("../Routers/auth");
const profile = require("../Routers/profile");
const requestrouter = require("../Routers/connections");
const userRouter = require("../Routers/userinterface");

const cookieParser = require("cookie-parser");
const cors = require("cors");

// Middleware for Cookies
app.use(cookieParser());

// ✅ CORS Middleware (Placed at the top)
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true  // ✅ Allows credentials (cookies, auth headers)
}));

// ✅ Manually Handle Preflight Requests (Fixes OPTIONS request failure)
// app.options("*", (req, res) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");  // ✅ Required for cookies/sessions
//     res.sendStatus(200);
// });

// Middleware for JSON Parsing
app.use(express.json());

// Routes
app.use("/", authrouter);
app.use("/", profile);
app.use("/", requestrouter);
app.use("/", userRouter);

// Start Server
storage().then(() => {
    console.log("Database has been connected");
    app.listen(1999, () => {
        console.log("Server is running on port 1999");
    });
});
