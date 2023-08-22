"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/unbound-method */
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var AuthController_1 = require("../controllers/AuthController");
var UserRoutes = /** @class */ (function () {
    function UserRoutes() {
        this.authController = new AuthController_1.default();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    UserRoutes.prototype.routes = function () {
        this.router.delete("/me", this.authController.authenticateJWT, UserController_1.default.deleteUser);
        this.router.put("/changePassword", this.authController.authenticateJWT, UserController_1.default.changePassword);
    };
    return UserRoutes;
}());
exports.UserRoutes = UserRoutes;
//# sourceMappingURL=user.js.map