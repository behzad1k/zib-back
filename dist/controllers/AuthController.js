"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
require("../middlewares/passport");
var roles_1 = require("../utils/roles");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.authenticateJWT = function (req, res, next) {
        passport.authenticate("jwt", function (err, user) {
            if (err) {
                return res.status(401).json({ status: "error", code: "401" });
            }
            if (!user) {
                return res.status(401).json({ status: "error", code: "401" });
            }
            else {
                return next();
            }
        })(req, res, next);
    };
    AuthController.prototype.authorizeJWTAdmin = function (req, res, next) {
        passport.authenticate("jwt", function (err, user) {
            if (err) {
                return res.status(401).json({ status: "error", code: "401" });
            }
            if (!user) {
                return res.status(401).json({ status: "error", code: "401" });
            }
            if (user.role !== roles_1.roles.SUPER_ADMIN && user.role !== roles_1.roles.OPERATOR) {
                return res.status(403).json({ status: "error", code: "403" });
            }
            else {
                return next();
            }
        })(req, res, next);
    };
    AuthController.prototype.authorizeJWT = function (req, res, next) {
        passport.authenticate("jwt", function (err, user, jwtToken) {
            if (err) {
                return res.status(401).json({ status: "error", code: "unauthorized" });
            }
            if (!user) {
                return res.status(401).json({ status: "error", code: "unauthorized" });
            }
            else {
                var scope = req.baseUrl.split("/").slice(-1)[0];
                var authScope = jwtToken.scope;
                if (authScope && authScope.indexOf(scope) > -1) {
                    return next();
                }
                else {
                    return res.status(401).json({ status: "error", code: "unauthorized" });
                }
            }
        })(req, res, next);
    };
    return AuthController;
}());
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map