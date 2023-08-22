import { Router } from "express";
import AuthController from "../controllers/AuthController";
import OrderController from "../controllers/OrderController";
import ServiceController from "../controllers/ServiceController";

export class OrderRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", OrderController.index);
    this.router.post("/create", OrderController.create);
  }
}
