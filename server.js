require('dotenv').config();

const express = require("express");
const app = express();
const path = require('path')
const PORT = process.env.PORT || 3500;

const cors = require('cors');//nc

const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyMyJWT");
const mongoose = require('mongoose');
const connectDB = require('./config/db_connect');

connectDB();


const whitelist = [
    "http://localhost:5173",
    "http://localhost:5174"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('This domain blocked by CORS. Frontend cant get backend'));
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

app.use('/login', require("./routes/loginMyUser"));
app.use('/refresh', require("./routes/refreshToken"));
app.use('/register', require("./routes/registerUser"));
app.use('/employees', verifyJWT, require("./routes/employees"));
app.use('/logout', require("./routes/logoutUser"))
app.use('/', require("./routes/root"));

mongoose.connection.once("open", () => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`The server is running on port http://localhost/${PORT}`))
});
