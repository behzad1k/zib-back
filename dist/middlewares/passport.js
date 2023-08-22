"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
var config_1 = require("../config/config");
var passport_jwt_1 = require("passport-jwt");
var passport = require("passport");
var options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    issuer: config_1.default.issuer,
    audience: config_1.default.audience,
    secretOrKey: config_1.default.jwtSecret,
};
console.log(passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken());
passport.use("jwt", new passport_jwt_1.Strategy(options, function (token, done) {
    var user = token;
    if (user) {
        return done(null, user, token);
    }
    else {
        return done(false, false);
    }
}));
//# sourceMappingURL=passport.js.map