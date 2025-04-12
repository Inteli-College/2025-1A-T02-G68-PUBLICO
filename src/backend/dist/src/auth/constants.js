"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
const dotenv_1 = require("dotenv");
dotenv_1.default.config();
exports.jwtConstants = {
    secret: process.env.JWT_SECRET,
};
//# sourceMappingURL=constants.js.map