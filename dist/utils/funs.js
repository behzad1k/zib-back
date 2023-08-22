"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTPCode = exports.getUserId = void 0;
var jwtDecode = require("jwt-decode");
var getUserId = function (token) {
    var tokens = jwtDecode(token);
    return tokens.userId;
};
exports.getUserId = getUserId;
var generateOTPCode = function () {
    var length = 6, charset = "0123456789", retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};
exports.generateOTPCode = generateOTPCode;
//# sourceMappingURL=funs.js.map