"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
var express_1 = require("express");
var AuthController_1 = require("../controllers/AuthController");
var address_1 = require("./admin/address");
var service_1 = require("./admin/service");
var AdminRoutes = /** @class */ (function () {
    function AdminRoutes() {
        this.authController = new AuthController_1.default();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    AdminRoutes.prototype.routes = function () {
        this.router.use("/address", this.authController.authorizeJWTAdmin, new address_1.AdminAddressRoutes().router);
        this.router.use("/service", this.authController.authorizeJWTAdmin, new service_1.AdminServiceRoutes().router);
    };
    return AdminRoutes;
}());
exports.AdminRoutes = AdminRoutes;
//# sourceMappingURL=admin.js.map