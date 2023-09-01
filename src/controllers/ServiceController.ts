import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import {Service} from "../entity/Service";

class ServiceController {
  static services = () => getRepository(Service)

  static index = async (req: Request, res: Response): Promise<Response> => {
    const services = await this.services().find({
      relations: ['attributes'],
      where: {
        parentId: null
      }
    });
    return res.status(200).send({
      code: 200,
      data: services
    })
  }
}

export default ServiceController;
