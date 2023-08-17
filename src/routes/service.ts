import { Router } from "express";
import AuthController from "../controllers/AuthController";
import ServiceController from "../controllers/ServiceController";

export class ServiceRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", ServiceController.index);
  }
}
