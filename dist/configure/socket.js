"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const taskModel_1 = __importDefault(require("../models/taskModel"));
const initializeSocket = (server) => {
    const users = {};
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
    });
    io.on('connection', (socket) => {
        console.log("Socket connected: ", socket.id);
        socket.on("user_login", (user_id) => {
            console.log("Socket turned on for user:", user_id);
        });
        socket.on('task', (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
            if (data) {
                data.userId = user_id;
                console.log(data);
                const tasks = new taskModel_1.default(data);
                yield tasks.save();
                socket.emit('task_added', { message: "Task added successfully" });
            }
            console.log(data, user_id);
        }));
        socket.on('delete', (taskId) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(taskId);
            const remove = yield taskModel_1.default.deleteOne({ _id: taskId });
            if (remove.acknowledged) {
                socket.emit("task_deleted", { message: "Task deleted successfully", taskId });
            }
        }));
        socket.on('edit', (taskId, data, userId) => __awaiter(void 0, void 0, void 0, function* () {
            const update = yield taskModel_1.default.updateOne({ _id: taskId }, { $set: data });
            if (update.acknowledged) {
                socket.emit("task_edited", { message: "Task edited successfully" });
            }
        }));
        socket.on('disconnect', () => {
            console.log("Socket disconnected: ", socket.id);
        });
    });
};
exports.initializeSocket = initializeSocket;
