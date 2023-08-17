import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { AdminAddressRoutes } from "./admin/address";
import { AdminServiceRoutes } from "./admin/service";

export class AdminRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.use("/address",this.authController.authorizeJWTAdmin,new AdminAddressRoutes().router)
    this.router.use("/service",this.authController.authorizeJWTAdmin,new AdminServiceRoutes().router)

  }
}
