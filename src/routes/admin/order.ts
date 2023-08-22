import { Router } from "express";
import AdminOrderController from "../../controllers/admin/AdminOrderController";
import OrderController from "../../controllers/OrderController";

export class AdminOrderRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", AdminOrderController.index);
    this.router.put("/update", AdminOrderController.update);
  }
}
