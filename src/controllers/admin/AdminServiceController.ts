import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Order } from "../../entity/Order";
import { Service } from "../../entity/Service";
import { User } from "../../entity/User";
import { getSlug } from "../../utils/funs";

class AdminServiceController {
  static users = () => getRepository(User)
  static orders = () => getRepository(Order)
  static services = () => getRepository(Service)

  static index = async (req: Request, res: Response): Promise<Response> => {
    const services = await this.services().find({
      relations: ['parent']
    });
    return res.status(200).send({
      code: 200,
      data: services
    })
  }
  static create = async (req: Request, res: Response): Promise<Response> => {
    const { title, description, price, parent, section, hasColor } = req.body;
    let parentObj;
    if (parent){
      try {
        parentObj = await this.services().findOne({
          where: {
            slug: parent
          }
        })
      }catch (e){
        return res.status(400).send({"code": 400, 'message': 'Invalid Parent'})
      }
    }
    const service = new Service();
    service.title = title;
    service.description = description;
    service.price = parseFloat(price);
    service.slug = await getSlug(this.services(),title)
    service.section = section
    service.parentId = parentObj?.id || null
    if (hasColor)
      service.hasColor = hasColor
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
    const { service, title, description, price, section, hasColor } = req.body;
    let serviceObj: Service;
    try {
      serviceObj = await this.services().findOneOrFail({
        where: {
          slug: service
        }
      });
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Id"});
      return;
    }
    if (title)
      serviceObj.title = title;
    if (description)
      serviceObj.description = description;
    if (price)
      serviceObj.price = parseFloat(price);
    if (section)
      serviceObj.section = section
    if (hasColor)
      service.hasColor = hasColor
    const errors = await validate(serviceObj);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.services().save(serviceObj);
    } catch (e) {
      res.status(409).send("error try again later");
      return;
    }
    return res.status(200).send({code: 200, data: serviceObj});
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { service } = req.body
    let serviceObj;
    try {
      serviceObj = await this.services().findOneOrFail({
        where: {
          slug: service
        }
      });
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Id"});
      return;
    }
    try{
      await this.services().delete(serviceObj.id);

    }catch (e){
      res.status(409).send("error try again later");
    }
    return res.status(204).send({});
  };

}

export default AdminServiceController;
