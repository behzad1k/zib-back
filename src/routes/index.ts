import { Router } from "express";
import { AddressRoutes } from "./address";
import { AdminRoutes } from "./admin";
import { OrderRoutes } from "./order";
import { UserRoutes } from "./user";
import { AuthRoutes } from "./auth";
import { ServiceRoutes } from "./service";

const routes = Router();

// routes.use("/auth", auth);
routes.use("/admin", new AdminRoutes().router);
routes.use("/address", new AddressRoutes().router);
routes.use("/user", new UserRoutes().router);
routes.use("/service", new ServiceRoutes().router);
routes.use("/order", new OrderRoutes().router);
routes.use("", new AuthRoutes().router);
export default routes;
