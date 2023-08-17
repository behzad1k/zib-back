import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Service } from "../../entity/Service";

class AdminServiceController {

  static create = async (req: Request, res: Response): Promise<Response> => {
    const { title, description, price } = req.body;
    const service = new Service();
    service.title = title;
    service.description = description;
    service.price = parseFloat(price);
    const errors = await validate(service);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    const serviceRepository = getRepository(Service);
    try {
      await serviceRepository.save(service);
    } catch (e) {
      res.status(409).send({"code": 409});
      return;
    }
    return res.status(201).send({ code: 201, data: service});
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id, title, description, price } = req.body;
    const serviceRepository = getRepository(Service);
    let service: Service;
    try {
      service = await serviceRepository.findOneOrFail(id);
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
      await serviceRepository.save(service);
    } catch (e) {
      res.status(409).send("error try again later");
      return;
    }
    return res.status(200).send({code: 400, data: service});
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const id: number = req.body.id
    const serviceRepository = getRepository(Service);

    let service;

    try {
      await serviceRepository.findOneOrFail(id);
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid Id"});
      return;
    }
    try{
      await serviceRepository.delete(id);

    }catch (e){
      res.status(409).send("error try again later");
    }
    return res.status(204).send();
  };

}

export default AdminServiceController;
