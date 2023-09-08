import { Request, Response } from "express";
import * as jwtDecode from "jwt-decode";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Address } from "../entity/Address";
import { Order } from "../entity/Order";
import { Service } from "../entity/Service";
import { User } from "../entity/User";
import { WorkerOffs } from '../entity/WorkerOffs';
import { orderStatuses, times } from "../utils/consts";
import { getObjectValue, omit } from "../utils/funs";

class OrderController {

  static users = () => getRepository(User)
  static orders = () => getRepository(Order)
  static services = () => getRepository(Service)
  static addresses = () => getRepository(Address)
  static workerOffs = () => getRepository(WorkerOffs)
  static index = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const users = await this.users().find();
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
        },
        relations: ['attributes', 'service', 'address', 'worker']
      })
    }else{
      orders = await this.orders().find({
        where: {
          userId: user.id,
          inCart: false
        },
        relations: ['attributes', 'service', 'address', 'worker']
      })
    }
    return res.status(200).send({
      code: 200,
      data: orders
    })
  }
  static workers = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const { serviceId, addressId } = req.query;
    let user, service, address;
    try {
      user = await this.users().findOneOrFail(userId);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid User"});
      return;
    }
    try {
      service = await this.services().findOneOrFail(Number(serviceId));
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Service"});
      return;
    }
    try {
      address = await this.addresses().findOneOrFail(Number(addressId), {
        where: {
          userId: user.id
        }
      });
    } catch (error) {
      res.status(400).send({ code: 400, data:"Invalid Address" });
      return;
    }
    const workers = await this.users().find({
      where: {
        serviceId: service.id,
        district: address.district
      }
    })
    return res.status(200).send({ code: 200, data: { workers } })
  }

  static create = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const { service, attribute, date, time, addressId, workerId } = req.body;
    let user, serviceObj, attributeObj, addressObj, worker;
    try {
      user = await this.users().findOneOrFail(userId);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid User"});
      return;
    }
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
    if (workerId) {
      try {
        worker = await this.users().findOneOrFail(workerId);
      } catch (error) {
        res.status(400).send({ code: 400, data: 'Invalid User' });
        return;
      }
    }

    if (!getObjectValue(times, time)){
      return res.status(400).send({ code: 400, data: "Invalid time"})
    }

    const order = new Order();
    order.price = serviceObj.price + attributeObj?.price
    order.service = serviceObj
    order.user = user
    order.status = 'CREATED'
    // order.attribute = attributeObj
    order.address = addressObj;
    order.date = date
    order.fromTime = time
    // order.toTime = time +
    order.worker = worker
    const errors = await validate(order);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.orders().save(order);
      const workerOff = new WorkerOffs();
      workerOff.orderId = order.id;
      workerOff.worker = worker.id;
      workerOff.date = order.date;
      workerOff.toTime = order.toTime;
      workerOff.toTime = order.toTime;
      // await this.workerOffs().save();
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
      relations: ['attributes', 'service', 'address']
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
  static delete = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const {orderId} = req.body;
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
      orderObj = await this.orders().findOneOrFail(orderId)
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Order"});
      return;
    }
    if (user.id != orderObj.userId){
      return res.status(403).send({code: 403, body: "Access Forbidden"})
    }
    try{
      await this.orders().delete(orderObj.id);
    }catch (e){
      return res.status(409).send("error try again later");
    }
    return res.status(200).send({code: 200})
  }
}

export default OrderController;
