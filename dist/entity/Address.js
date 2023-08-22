"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var User_1 = require("./User");
var Address = exports.Address = /** @class */ (function () {
    function Address() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Address.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(3, 100),
        __metadata("design:type", String)
    ], Address.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Address.prototype, "userId", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(3, 100),
        __metadata("design:type", String)
    ], Address.prototype, "description", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Address.prototype, "phoneNumber", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Address.prototype, "longitude", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Address.prototype, "latitude", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Address.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], Address.prototype, "updatedAt", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; }, function (user) { return user.addresses; }),
        (0, typeorm_1.JoinColumn)({ name: "userId", referencedColumnName: "id" }),
        __metadata("design:type", User_1.User
        // @ManyToMany(() => User,(user) => user.likedTweaks)
        // @JoinTable({
        //   name: "like",
        // })
        // likes : User[];
        // @ManyToOne((type) => Service,(tweak) => tweak.children  )
        // @JoinColumn({ name:"parentId", referencedColumnName: "id"})
        // parent: Service;
        //
        // @OneToMany((type) => Service,(tweak) => tweak.parent  )
        // @JoinColumn({ name:"parentId", referencedColumnName: "id"})
        // children: Service;
        //
        // @ManyToOne(type => User,user => user.tweaks)
        // @JoinColumn({name:'userId', referencedColumnName: "id" })
        // user: User;
        )
    ], Address.prototype, "user", void 0);
    Address = __decorate([
        (0, typeorm_1.Entity)()
    ], Address);
    return Address;
}());
//# sourceMappingURL=Address.js.map