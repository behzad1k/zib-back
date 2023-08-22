import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Order } from "../../entity/Order";
import { Service } from "../../entity/Service";
import { User } from "../../entity/User";
import { getSlug } from "../../utils/funs";

class AdminServiceController {
  static users = () => getRepository(User)
  static orders = () => getRepository(Order)
  static services = () => getRepository(Service)

  static create = async (req: Request, res: Response): Promise<Response> => {
    const { title, description, price } = req.body;
    const service = new Service();
    service.title = title;
    service.description = description;
    service.price = parseFloat(price);
    service.slug = await getSlug(this.services(),service.title)
    const errors = await validate(service);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.services().save(service);
    } catch (e) {
      res.status(409).send({"code": 409});
      return;
    }
    return res.status(201).send({ code: 201, data: service});
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id, title, description, price } = req.body;
    let service: Service;
    try {
      service = await this.services().findOneOrFail(id);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Id"});
      return;
    }
    service.title = title;
    service.description = description;
    service.price = parseFloat(price);
    const errors = await validate(service);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.services().save(service);
    } catch (e) {
      res.status(409).send("error try again later");
      return;
    }
    return res.status(200).send({code: 400, data: service});
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const id: number = req.body.id
    let service;
    try {
      await this.services().findOneOrFail(id);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Id"});
      return;
    }
    try{
      await this.services().delete(id);

    }catch (e){
      res.status(409).send("error try again later");
    }
    return res.status(204).send();
  };

}

export default AdminServiceController;
