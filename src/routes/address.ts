import { Router } from "express";
import AddressController from "../controllers/AddressController";
import AuthController from "../controllers/AuthController";

export class AddressRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", this.authController.authenticateJWT, AddressController.index);
    this.router.post("", this.authController.authenticateJWT, AddressController.create);
    this.router.put("", this.authController.authenticateJWT, AddressController.update);
    this.router.delete("", this.authController.authenticateJWT, AddressController.delete);
  }
}
