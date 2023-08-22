"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var admin_1 = require("./admin");
var user_1 = require("./user");
var auth_1 = require("./auth");
var service_1 = require("./service");
var routes = (0, express_1.Router)();
// routes.use("/auth", auth);
routes.use("/admin", new admin_1.AdminRoutes().router);
routes.use("/user", new user_1.UserRoutes().router);
routes.use("/service", new service_1.ServiceRoutes().router);
routes.use("", new auth_1.AuthRoutes().router);
exports.default = routes;
//# sourceMappingURL=index.cjs.map