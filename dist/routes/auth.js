"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/unbound-method */
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var AuthController_1 = require("../controllers/AuthController");
var AuthRoutes = /** @class */ (function () {
    function AuthRoutes() {
        this.authController = new AuthController_1.default();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    AuthRoutes.prototype.routes = function () {
        // Login route
        this.router.post("/login", UserController_1.default.login);
        // Auth check
        this.router.post("/check", UserController_1.default.authCheck);
    };
    return AuthRoutes;
}());
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=auth.js.map