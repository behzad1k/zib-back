"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServiceRoutes = void 0;
var express_1 = require("express");
var AdminServiceController_1 = require("../../controllers/admin/AdminServiceController");
var AdminServiceRoutes = /** @class */ (function () {
    function AdminServiceRoutes() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    AdminServiceRoutes.prototype.routes = function () {
        this.router.post("/create", AdminServiceController_1.default.create);
        this.router.put("/update", AdminServiceController_1.default.update);
        this.router.delete("/delete", AdminServiceController_1.default.delete);
    };
    return AdminServiceRoutes;
}());
exports.AdminServiceRoutes = AdminServiceRoutes;
//# sourceMappingURL=service.js.map