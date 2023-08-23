import { Request, Response } from "express";
import { getRepository, Not } from "typeorm";
import { validate } from "class-validator";
import { Order } from "../../entity/Order";
import { Service } from "../../entity/Service";
import { User } from "../../entity/User";
import { roles } from "../../utils/consts";
import { getObjectValue, getSlug } from "../../utils/funs";

class AdminUserController {
  static users = () => getRepository(User)
  static orders = () => getRepository(Order)
  static services = () => getRepository(Service)

  static index = async (req: Request, res: Response): Promise<Response> => {
    const users = await this.users().find();
    return res.status(200).send({'code': 200, 'data': users})
  }
  static create = async (req: Request, res: Response): Promise<Response> => {
    const { name, lastName, nationalCode, role, phoneNumber } = req.body;
    if (!phoneNumber && await this.users().findOne({
      where: {
        phoneNumber: phoneNumber
      }
    })){
      return res.status(400).send({"code": 400, 'data': 'Duplicate PhoneNumber'})
    }
    if (!nationalCode && await this.users().findOne({
      where: {
        nationalCode: nationalCode
      }
    })){
      return res.status(400).send({"code": 400, 'data': 'Duplicate NationalCode'})
    }
    if (!getObjectValue(roles,role)){
      return res.status(400).send({"code": 400, 'data': 'Invalid Role'})
    }
    const user = new User();
    user.name = name
    user.lastName = lastName
    user.nationalCode = nationalCode
    user.role = role
    user.phoneNumber = phoneNumber
    user.password = '12345678'
    await user.hashPassword();
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.users().save(user);
    } catch (e) {
      res.status(409).send({"code": 409});
      return;
    }
    return res.status(201).send({ code: 201, data: user});
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { userId, name, lastName, nationalCode, role, phoneNumber } = req.body;
    let user: User;
    try{
      user = await this.users().findOneOrFail(userId)
    }catch (e){
      return res.status(400).send({"code": 400, 'data': 'Invalid UserId'})
    }
    if (!phoneNumber && await this.users().findOne({
      where: {
        id: Not(userId),
        phoneNumber: phoneNumber
      }
    })){
      return res.status(400).send({"code": 400, 'data': 'Duplicate PhoneNumber'})
    }
    if (!nationalCode && await this.users().findOne({
      where: {
        id: Not(userId),
        nationalCode: nationalCode
      }
    })){
      return res.status(400).send({"code": 400, 'data': 'Duplicate NationalCode'})
    }
    if (!getObjectValue(roles,role)){
      return res.status(400).send({"code": 400, 'data': 'Invalid Status'})
    }
    if (name)
      user.name = name
    if (lastName)
      user.lastName = lastName
    if(nationalCode)
      user.nationalCode = nationalCode
    if (role)
      user.role = role
    if (phoneNumber)
      user.phoneNumber = phoneNumber
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.users().save(user);
    } catch (e) {
      res.status(409).send({"code": 409});
      return;
    }
    return res.status(200).send({ code: 200, data: user});
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const userId: number = req.body.userId
    let user;
    try {
      user = await this.users().findOneOrFail(userId);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid UserId"});
      return;
    }
    try{
      await this.users().delete(user.id);
    }catch (e){
      res.status(409).send("error try again later");
    }
    return res.status(204).send({code: 204, data: "Success"});
  };

}

export default AdminUserController;
