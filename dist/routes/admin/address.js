"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAddressRoutes = void 0;
var express_1 = require("express");
var AdminAddressController_1 = require("../../controllers/admin/AdminAddressController");
var AuthController_1 = require("../../controllers/AuthController");
var AdminAddressRoutes = /** @class */ (function () {
    function AdminAddressRoutes() {
        this.authController = new AuthController_1.default();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    AdminAddressRoutes.prototype.routes = function () {
        // Get own user
        this.router.get("/", AdminAddressController_1.default.index);
        this.router.post("/create", AdminAddressController_1.default.create);
        this.router.put("/update", AdminAddressController_1.default.update);
        this.router.delete("/delete", AdminAddressController_1.default.delete);
    };
    return AdminAddressRoutes;
}());
exports.AdminAddressRoutes = AdminAddressRoutes;
//# sourceMappingURL=address.js.map