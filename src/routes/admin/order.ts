import { Router } from "express";
import AdminOrderController from "../../controllers/admin/AdminOrderController";

export class AdminOrderRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.put("/updateStatus", AdminOrderController.updateStatus);
  }
}
