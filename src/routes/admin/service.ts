import { Router } from "express";
import AdminServiceController from "../../controllers/admin/AdminServiceController";

export class AdminServiceRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminServiceController.index);
    this.router.post("", AdminServiceController.create);
    this.router.put("", AdminServiceController.update);
    this.router.delete("", AdminServiceController.delete);
  }
}
