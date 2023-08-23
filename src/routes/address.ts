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

    // Get own user
    this.router.get("", AddressController.index);
    this.router.post("", this.authController.authorizeJWT, AddressController.create);
    this.router.put("", this.authController.authorizeJWT, AddressController.update);
    this.router.delete("", this.authController.authorizeJWT, AddressController.delete);
  }
}
