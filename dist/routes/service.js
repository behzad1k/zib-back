"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoutes = void 0;
var express_1 = require("express");
var ServiceController_1 = require("../controllers/ServiceController");
var ServiceRoutes = /** @class */ (function () {
    function ServiceRoutes() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    ServiceRoutes.prototype.routes = function () {
        this.router.get("/", ServiceController_1.default.index);
    };
    return ServiceRoutes;
}());
exports.ServiceRoutes = ServiceRoutes;
//# sourceMappingURL=service.js.map