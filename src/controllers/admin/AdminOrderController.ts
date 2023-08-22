import { Request, Response } from "express";
import { stat } from "fs";
import * as jwtDecode from "jwt-decode";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import {Order} from "../../entity/Order";
import { Service } from "../../entity/Service";
import { User } from "../../entity/User";
import { orderStatuses } from "../../utils/consts";

class AdminOrderController {
  static users = () => getRepository(User)
  static orders = () => getRepository(Order)
  static services = () => getRepository(Service)
  static index = async (req: Request, res: Response): Promise<Response> => {
    const orders = await this.orders().find();
    return res.status(200).send({
      code: 200,
      data: orders
    })
  }

  static updateStatus = async (req: Request, res: Response): Promise<Response> => {
    const { orderId, status } = req.body;
    let order: Order;
    try {
      order = await this.orders().findOneOrFail(orderId);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Order"});
      return;
    }
    order.status = status
    const errors = await validate(order);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.orders().save(order);
    } catch (e) {
      res.status(409).send("error try again later");
      return;
    }
    return res.status(200).send({code: 200, data: order});
  };

}
// AdminOrderController._initialize()
export default AdminOrderController;
