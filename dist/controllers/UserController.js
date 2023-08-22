"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var config_1 = require("../config/config");
var User_1 = require("../entity/User");
var jwt = require("jsonwebtoken");
var jwtDecode = require("jwt-decode");
var funs_1 = require("../utils/funs");
var roles_1 = require("../utils/roles");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    var _a;
    _a = UserController;
    // Authentication
    UserController.signJWT = function (user, exp) { return __awaiter(void 0, void 0, void 0, function () {
        var token;
        return __generator(_a, function (_b) {
            token = jwt.sign({
                userId: user.id,
                role: user.role,
            }, config_1.default.jwtSecret, {
                expiresIn: exp ? exp : config_1.default.expiration,
                issuer: config_1.default.issuer,
                audience: config_1.default.audience,
            });
            return [2 /*return*/, token];
        });
    }); };
    UserController.login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var phoneNumber, userRepository, code, token, user;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    phoneNumber = req.body.phoneNumber;
                    if (!(phoneNumber)) {
                        return [2 /*return*/, res.status(400).send({ 'message': 'Phone number not set' })];
                    }
                    userRepository = (0, typeorm_1.getRepository)(User_1.User);
                    code = (0, funs_1.generateOTPCode)();
                    token = '';
                    return [4 /*yield*/, userRepository.findOne({ where: { phoneNumber: phoneNumber } })];
                case 1:
                    user = _b.sent();
                    if (!!user) return [3 /*break*/, 4];
                    user = new User_1.User();
                    user.phoneNumber = phoneNumber;
                    user.role = roles_1.roles.USER;
                    user.password = '12345678';
                    // user.password = user.generatePassword();
                    return [4 /*yield*/, user.hashPassword()];
                case 2:
                    // user.password = user.generatePassword();
                    _b.sent();
                    return [4 /*yield*/, userRepository.save(user)];
                case 3:
                    user = _b.sent();
                    _b.label = 4;
                case 4:
                    user.tmpCode = code;
                    return [4 /*yield*/, userRepository.save(user)];
                case 5:
                    user = _b.sent();
                    return [4 /*yield*/, UserController.signJWT(user, '2m')];
                case 6:
                    token = _b.sent();
                    return [2 /*return*/, res.status(200).send({
                            code: code,
                            token: token
                        })];
            }
        });
    }); };
    UserController.authCheck = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _b, token, code, userId, userRepository, user, e_1, newToken, e_2;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = req.body, token = _b.token, code = _b.code;
                    userId = (0, funs_1.getUserId)(token);
                    userRepository = (0, typeorm_1.getRepository)(User_1.User);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, userRepository.findOneOrFail(userId)];
                case 2:
                    user = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    return [2 /*return*/, res.status(401).send({ 'message': 'User not found' })];
                case 4:
                    if (user.tmpCode !== code) {
                        return [2 /*return*/, res.status(401).send({ 'message': 'Code does not match' })];
                    }
                    return [4 /*yield*/, UserController.signJWT(user)];
                case 5:
                    newToken = _c.sent();
                    user.tmpCode = '';
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, userRepository.save(user)];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_2 = _c.sent();
                    return [2 /*return*/, res.status(409).send({ 'code': 409, 'data': 'error try again later' })];
                case 9: return [2 /*return*/, res.status(200).send({
                        user: user,
                        token: newToken
                    })];
            }
        });
    }); };
    UserController.changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var token, id, _b, oldPassword, newPassword, userRepository, user, error_1, errors;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    token = jwtDecode(req.headers.authorization);
                    id = token.userId;
                    _b = req.body, oldPassword = _b.oldPassword, newPassword = _b.newPassword;
                    if (!(oldPassword && newPassword)) {
                        res.status(400).send();
                    }
                    userRepository = (0, typeorm_1.getRepository)(User_1.User);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, userRepository.findOneOrFail(id)];
                case 2:
                    user = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    res.status(401).send();
                    return [3 /*break*/, 4];
                case 4:
                    // Check if old password matchs
                    // if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
                    //   res.status(401).send("Invalid password or wrong email!");
                    //   return;
                    // }
                    // Validate de model (password lenght)
                    user.password = newPassword;
                    return [4 /*yield*/, (0, class_validator_1.validate)(user)];
                case 5:
                    errors = _c.sent();
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return [2 /*return*/];
                    }
                    // Hash the new password and save
                    user.hashPassword();
                    userRepository.save(user);
                    return [2 /*return*/, res.status(204).send()];
            }
        });
    }); };
    UserController.deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, userRepository, error_2, error_3;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.body.id;
                    userRepository = (0, typeorm_1.getRepository)(User_1.User);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, userRepository.findOneOrFail(id)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    res.status(400).send("Invalid id");
                    return [2 /*return*/];
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, userRepository.delete(id)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _b.sent();
                    return [2 /*return*/, res.status(409).send("try again later")];
                case 7: return [2 /*return*/, res.status(204).send()];
            }
        });
    }); };
    UserController.getAddresses = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, userRepository, user, error_4;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.body.id;
                    userRepository = (0, typeorm_1.getRepository)(User_1.User);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, userRepository.findOneOrFail(id)];
                case 2:
                    user = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _b.sent();
                    res.status(400).send("Invalid id");
                    return [2 /*return*/];
                case 4: return [2 /*return*/, res.status(200).send({
                        code: '200',
                        data: user
                    })];
            }
        });
    }); };
    return UserController;
}());
exports.default = UserController;
//# sourceMappingURL=UserController.js.map