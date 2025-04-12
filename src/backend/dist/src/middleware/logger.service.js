"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("axios");
let LoggerService = class LoggerService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async logRequest(authHeader, ip, method, url) {
        const timestamp = new Date().toISOString();
        let user = 'Guest';
        let location = 'Unknown Location';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = this.jwtService.verify(token);
                user = decoded.email || decoded.userId || 'Unknown User';
            }
            catch (error) {
                user = 'Invalid Token';
            }
        }
        if (ip === '::1' || ip === '127.0.0.1') {
            ip = 'Localhost';
            location = 'Localhost';
        }
        else {
            try {
                const response = await axios_1.default.get(`http://ip-api.com/json/${ip}`);
                if (response.data && response.data.status === 'success') {
                    location = `${response.data.city}, ${response.data.country}`;
                }
            }
            catch (error) {
                location = 'Location not found';
            }
        }
        console.log(`[${timestamp}] User: ${user} | IP: ${ip} | Location: ${location} | ${method} ${url}`);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], LoggerService);
//# sourceMappingURL=logger.service.js.map