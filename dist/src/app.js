"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api', routes_1.default);
// Root Health Check
app.get('/', (req, res) => {
    res.send({ success: true, message: 'Server is running smoothly' });
});
// Global Error Handler (Must be registered last)
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map