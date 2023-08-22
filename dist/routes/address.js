"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRoutes = void 0;
var express_1 = require("express");
var AddressController_1 = require("../controllers/AddressController");
var AuthController_1 = require("../controllers/AuthController");
var AddressRoutes = /** @class */ (function () {
    function AddressRoutes() {
        this.authController = new AuthController_1.default();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    AddressRoutes.prototype.routes = function () {
        // Get own user
        this.router.get("/", AddressController_1.default.index);
        this.router.post("/create", this.authController.authorizeJWT, AddressController_1.default.create);
        this.router.put("/update", this.authController.authorizeJWT, AddressController_1.default.update);
        this.router.delete("/delete", this.authController.authorizeJWT, AddressController_1.default.delete);
    };
    return AddressRoutes;
}());
exports.AddressRoutes = AddressRoutes;
//# sourceMappingURL=address.js.map