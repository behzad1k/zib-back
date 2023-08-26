import { Request, Response } from "express";
import * as jwtDecode from "jwt-decode";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Address } from "../entity/Address";
import { Order } from "../entity/Order";
import { Service } from "../entity/Service";
import { User } from "../entity/User";
import { orderStatuses, times } from "../utils/consts";
import { getObjectValue, omit } from "../utils/funs";

class OrderController {

  static users = () => getRepository(User)
  static orders = () => getRepository(Order)
  static services = () => getRepository(Service)
  static addresses = () => getRepository(Address)
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
    let orders;
    if (user.role === 'WORKER'){
      orders = await this.orders().find({
        where: {
          workerId: user.id
        },
        relations: ['attribute', 'service', 'address']
      })
    }else{
      orders = await this.orders().find({
        where: {
          userId: user.id,
          inCart: false
        },
        relations: ['attribute', 'service', 'address']
      })
    }
    return res.status(200).send({
      code: 200,
      data: orders
    })
  }


  static create = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    let user, serviceObj, attributeObj, addressObj;
    try {
      user = await this.users().findOneOrFail(userId);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid User"});
      return;
    }
    const { service, attribute, date, time, addressId } = req.body;
    try {
      addressObj = await this.addresses().findOneOrFail(addressId, {
        where: {
          userId: user.id
        }
      })
    }catch (e){
      return res.status(400).send({'code': 400, data: 'Invalid Address'})
    }
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
          slug: attribute,
          parentId: serviceObj.id
        }
      });
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Attribute"});
      return;
    }
    if (!getObjectValue(times, time)){
      return res.status(400).send({ code: 400, data: "Invalid time"})
    }
    const order = new Order();
    order.price = serviceObj.price + attributeObj?.price
    order.service = serviceObj
    order.user = user
    order.status = 'CREATED'
    order.attribute = attributeObj
    order.address = addressObj;
    order.date = date
    order.time = time
    const errors = await validate(order);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.orders().save(order);
    } catch (e) {
      res.status(409).send({"code": 409});
      return;
    }
    const finalOrder = omit(['user'],order)
    return res.status(201).send({ code: 201, data: finalOrder});
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    let user, orderObj
    try {
      user = await this.users().findOneOrFail(userId);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid User"});
      return;
    }
    const { orderId, accept } = req.body;
    try {
      orderObj = await this.orders().findOneOrFail({
        where: {
          id: orderId,
          status: 'ASSIGNED',
          workerId: user.id,
        }
      });
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Order"});
      return;
    }
    if (accept){
      orderObj.status = "ACCEPTED"
      orderObj.worker = user
    }
    else{
      orderObj.status = "PAID"
      orderObj.worker = null
    }
    try {
      await this.orders().save(orderObj);
    } catch (e) {
      res.status(409).send("error try again later");
      return;
    }
    return res.status(200).send({code: 200, data: ""})
  }

  static cart = async (req: Request,res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let user;
    try {
      user = await this.users().findOneOrFail(id,{
        relations: ['orders']
      });
    }
    catch (error) {
      res.status(400).send({code: 400, data: "Invalid UserId"});
      return;
    }
    let orders = await this.orders().find({
      where: {
        userId: user.id,
        inCart: true
      },
      relations: ['attribute', 'service', 'address']
    })
    return res.status(200).send({code: 200, data: orders})
  }

  static pay = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    let user, orderObj
    try {
      user = await this.users().findOneOrFail(userId,{
        relations: ['orders']
      });
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid User"});
      return;
    }
    try {
      user.orders.map((value: Order) => {
        this.orders().update(value.id, {
          inCart: false,
          status: "PAID"
        })
      })
      return res.status(200).send({code: 200, data: ''})
    }catch (e){
      console.log(e)
      res.status(409).send({code: 409, data:"error try again later"});
    }
  }
}

export default OrderController;
