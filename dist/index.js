"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const db_1 = __importDefault(require("./configure/db"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = require("./configure/socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const url = process.env.URL;
(0, db_1.default)();
const server = http_1.default.createServer(app);
(0, socket_1.initializeSocket)(server);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.FRONTEND_PORT,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use('/', userRoute_1.default);
server.listen(port, () => {
    console.log(`Server started:${url}:${port}`);
});
