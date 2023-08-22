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
var Address_1 = require("../../entity/Address");
var AdminAddressController = /** @class */ (function () {
    function AdminAddressController() {
    }
    var _a;
    _a = AdminAddressController;
    AdminAddressController.index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var addressRepository, addresses;
        return __generator(_a, function (_b) {
            addressRepository = (0, typeorm_1.getRepository)(Address_1.Address);
            addresses = addressRepository.find();
            return [2 /*return*/, res.status(200).send({
                    code: 200,
                    data: addresses
                })];
        });
    }); };
    AdminAddressController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _b, title, description, longitude, latitude, phoneNumber, userId, address, errors, addressRepository, e_1;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = req.body, title = _b.title, description = _b.description, longitude = _b.longitude, latitude = _b.latitude, phoneNumber = _b.phoneNumber, userId = _b.userId;
                    address = new Address_1.Address();
                    address.title = title;
                    address.description = description;
                    address.longitude = longitude;
                    address.latitude = latitude;
                    address.phoneNumber = phoneNumber;
                    address.userId = userId;
                    return [4 /*yield*/, (0, class_validator_1.validate)(address)];
                case 1:
                    errors = _c.sent();
                    if (errors.length > 0) {
                        return [2 /*return*/, res.status(400).send(errors)];
                    }
                    addressRepository = (0, typeorm_1.getRepository)(Address_1.Address);
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, addressRepository.save(address)];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _c.sent();
                    return [2 /*return*/, res.status(409).send({ "code": 409 })];
                case 5: return [2 /*return*/, res.status(201).send({ code: 201, data: address })];
            }
        });
    }); };
    AdminAddressController.update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _b, id, title, description, longitude, latitude, phoneNumber, addressRepository, address, error_1, errors, e_2;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = req.body, id = _b.id, title = _b.title, description = _b.description, longitude = _b.longitude, latitude = _b.latitude, phoneNumber = _b.phoneNumber;
                    addressRepository = (0, typeorm_1.getRepository)(Address_1.Address);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, addressRepository.findOneOrFail(id)];
                case 2:
                    address = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    return [2 /*return*/, res.status(400).send({ code: 400, data: "Invalid Id" })];
                case 4:
                    address.title = title;
                    address.description = description;
                    address.longitude = longitude;
                    address.latitude = latitude;
                    address.phoneNumber = phoneNumber;
                    return [4 /*yield*/, (0, class_validator_1.validate)(address)];
                case 5:
                    errors = _c.sent();
                    if (errors.length > 0) {
                        return [2 /*return*/, res.status(400).send(errors)];
                    }
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, addressRepository.save(address)];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_2 = _c.sent();
                    return [2 /*return*/, res.status(409).send("error try again later")];
                case 9: return [2 /*return*/, res.status(200).send({ code: 400, data: address })];
            }
        });
    }); };
    AdminAddressController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, addressRepository, error_2, e_3;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.body.id;
                    addressRepository = (0, typeorm_1.getRepository)(Address_1.Address);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, addressRepository.findOneOrFail(id)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    res.status(400).send({ code: 400, data: "Invalid Id" });
                    return [2 /*return*/];
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, addressRepository.delete(id)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_3 = _b.sent();
                    res.status(409).send({ code: 409, data: "error try again later" });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, res.status(204).send()];
            }
        });
    }); };
    return AdminAddressController;
}());
exports.default = AdminAddressController;
//# sourceMappingURL=AdminAddressController.js.map