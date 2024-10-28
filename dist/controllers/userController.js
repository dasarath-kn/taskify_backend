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
exports.completedTasks = exports.updateStatus = exports.tasks = exports.userData = exports.signUp = exports.login = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jwt_1 = require("../configure/jwt");
const taskModel_1 = __importDefault(require("../models/taskModel"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = yield userModel_1.default.findOne({ email: email, password: password });
        const token = yield (0, jwt_1.jwtToken)(userData === null || userData === void 0 ? void 0 : userData._id);
        if (userData) {
            const id = userData._id;
            res.status(200).json({ success: true, message: "Userdata sent successfully", token, id });
        }
        else if (!userData) {
            res.status(200).json({ success: false, message: "User not found" });
        }
        else {
            res.status(400).json({ success: false, message: "Failed to sent userdata" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.login = login;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        console.log(req.body, "ppp");
        let findUser = yield userModel_1.default.findOne({ email: email, password: password });
        if (!findUser) {
            const userData = { name, email, password };
            let saveUser = new userModel_1.default(userData);
            let saved = yield saveUser.save();
            if (saved) {
                res.status(200).json({ success: true, message: "Signup completed" });
            }
            else {
                res.status(400).json({ success: false, message: "Failed to save userdata" });
            }
        }
        else {
            res.status(200).json({ success: true, message: "User already exist" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.signUp = signUp;
const userData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const userData = yield userModel_1.default.findOne({ _id: userId });
        const taskCompletedCount = yield taskModel_1.default.find({ userId: userId, status: "Completed" }).countDocuments();
        const taskPendingCount = yield taskModel_1.default.find({ userId: userId, status: "Pending" }).countDocuments();
        const taskOngoingCount = yield taskModel_1.default.find({ userId: userId, status: "Ongoing" }).countDocuments();
        console.log(taskCompletedCount, taskOngoingCount, taskPendingCount);
        const currentYear = new Date().getFullYear();
        const result = yield taskModel_1.default.aggregate([
            {
                $match: { status: 'Completed', enddate: { $regex: `^${currentYear}` } }
            },
            {
                $group: {
                    _id: { $month: { $dateFromString: { dateString: "$enddate" } } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        const monthlyCounts = Array(12).fill(0);
        result.forEach(item => {
            monthlyCounts[item._id - 1] = item.count;
        });
        console.log(monthlyCounts);
        if (userData) {
            res.status(200).json({ success: true, message: "Userdata sent successfully", userData, taskCompletedCount, taskOngoingCount, taskPendingCount, monthlyCounts });
        }
        else {
            res.status(400).json({ success: false, message: "Failed to sent userdata" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userData = userData;
const tasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const taskData = yield taskModel_1.default.find({ userId: userId, status: { $ne: "Completed" } });
        if (taskData) {
            res.status(200).json({ success: true, message: "Taskdata sent successfully", taskData });
        }
        else {
            res.status(400).json({ success: false, message: "Failed to sent task" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.tasks = tasks;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId, status } = req.body;
        const updatestatus = yield taskModel_1.default.updateOne({ _id: taskId }, { $set: { status: status } });
        if (updatestatus.acknowledged) {
            res.status(200).json({ success: true, message: "Status changed" });
        }
        else {
            res.status(400).json({ success: false, message: "Failed to change status" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateStatus = updateStatus;
const completedTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        console.log(userId);
        const completedTasks = yield taskModel_1.default.find({ userId: userId, status: { $eq: "Completed" } });
        console.log(completedTasks);
        if (completedTasks) {
            res.status(200).json({ success: true, message: "Completed task data sent successfully", completedTasks });
        }
        else {
            res.status(400).json({ success: false, message: "Failed to sent completed tasks" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.completedTasks = completedTasks;
