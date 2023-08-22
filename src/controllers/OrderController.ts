import { Request, Response } from "express";
import * as jwtDecode from "jwt-decode";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Attribute } from "../entity/Attribute";
import { Order } from "../entity/Order";
import {Service} from "../entity/Service";
import { User } from "../entity/User";
import { orderStatuses } from "../utils/consts";

class OrderController {

  static users = () => getRepository(User)
  static orders = () => getRepository(Order)
  static services = () => getRepository(Service)
  static attributes = () => getRepository(Attribute)
  static index = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    let user;
    try {
      user = await this.users().findOneOrFail(userId);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid User"});
      return;
    }
    const orders = user.orders;
    return res.status(200).send({
      code: 200,
      data: orders
    })
  }


  static create = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    let user, serviceObj, attributeObj;
    try {
      user = await this.users().findOneOrFail(userId);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid User"});
      return;
    }
    const { service, attribute } = req.body;
    try {
      serviceObj = await this.services().findOneOrFail({
        where: {
          slug: service
        }
      });
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Service"});
      return;
    }
    try {
      attributeObj = await this.services().findOneOrFail({
        where: {
          slug: attribute
        }
      });
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Attribute"});
      return;
    }
    const order = new Order();
    order.price = serviceObj.price
    order.service = serviceObj
    order.user = user
    order.status = orderStatuses.CREATED
    const errors = await validate(order);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.orders().save(order);
    } catch (e) {
      console.log(e)
      res.status(409).send({"code": 409});
      return;
    }
    return res.status(201).send({ code: 201, data: order});
  };

}

export default OrderController;
