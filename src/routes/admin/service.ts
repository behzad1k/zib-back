import { Router } from "express";
import AdminServiceController from "../../controllers/admin/AdminServiceController";

export class AdminServiceRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post("/create", AdminServiceController.create);
    this.router.put("/update", AdminServiceController.update);
    this.router.delete("/delete", AdminServiceController.delete);
  }
}
