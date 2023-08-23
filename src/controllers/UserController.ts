import { CANCELLED } from "dns";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import config from "../config/config";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import * as jwtDecode from "jwt-decode";
import { Service } from "../entity/Service";
import { generateOTPCode, getUserId, omit } from "../utils/funs";
import { roles } from "../utils/consts";

class UserController {
  static users = () => getRepository(User)

  // Authentication
  static signJWT = async (user: { id: any; role: any },exp?): Promise<string> => {
    const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
        },
        config.jwtSecret,
        {
          expiresIn: exp ? exp : config.expiration,
          issuer: config.issuer,
          audience: config.audience,
        },
    );

    return token;
  };

  static login = async (req: Request, res: Response): Promise<Response> => {
    const {phoneNumber} = req.body;
    if (!(phoneNumber)) {
      return res.status(400).send({'message': 'Phone number not set'});
    }
    const userRepository = getRepository(User);
    const code = generateOTPCode();
    let token = '';
    let user: User;
    user = await userRepository.findOne({where: {phoneNumber}});
    if (!user) {
      user = new User()
      user.phoneNumber = phoneNumber;
      user.role = roles.USER
      user.password = '12345678';
      // user.password = user.generatePassword();
      await user.hashPassword();
      user = await userRepository.save(user);
    }
    user.tmpCode = code;
    user = await userRepository.save(user);
    token = await UserController.signJWT(user,'2m');
    return res.status(200).send({
      code: code,
      token: token
    });
  };

  static authCheck = async (req: Request, res: Response): Promise<Response> => {
    const {token, code} = req.body
    if (! token && code){
      return res.status(400).send({'message': 'Bad Request'})
    }
    const userId = getUserId(token)
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(userId);
    } catch (e) {
      return res.status(401).send({'message': 'User not found'})
    }
    if (user.tmpCode !== code) {
      return res.status(401).send({'message': 'Code does not match'})
    }
    const newToken = await UserController.signJWT(user)
    user.tmpCode = ''
    try{
      await userRepository.save(user)
    }catch (e){
      return res.status(409).send({'code': 409, 'data': 'error try again later'})
    }

    return res.status(200).send({
      code: 200,
      data: {
        user: user,
        token: newToken
      }
    });
  }

  static getUser = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let user;
    try{
      user = await this.users().findOneOrFail(id)
    }catch (e){
      return res.status(400).send({'code' : 400, 'data': 'Invalid User'})
    }
    return res.status(200).send({'code': 200, 'data' : user});
  }
  static changePassword = async (req: Request, res: Response): Promise<Response> => {
    // Get ID from JWT
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    // Get parameters from the body
    const {oldPassword, newPassword} = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(401).send();
    }

    // Check if old password matchs
    // if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
    //   res.status(401).send("Invalid password or wrong email!");
    //   return;
    // }

    // Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    // Hash the new password and save
    // user.hashPassword();
    userRepository.save(user);

    return res.status(204).send();
  };

  static update = async (req: Request,res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let user;
    try{
      user = await this.users().findOneOrFail(id)
    }catch (e){
      return res.status(400).send({code: 400, data: "Invalid User"})
    }
    const {name, lastName, nationalCode, phoneNumber} = req.body;
    if(name)
      user.name = name
    if(lastName)
      user.lastName = lastName
    if(nationalCode)
      user.nationalCode = nationalCode
    if(phoneNumber)
      user.phoneNumber = phoneNumber
    try {
      await this.users().save(user);
    } catch (e) {
      return res.status(409).send({"code": 409});
    }
    return res.status(200).send({code: 200, user})
  }
  static getAddresses = async (req: Request,res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id,{
        relations: ['addresses']
      });
    }
    catch (error) {
      res.status(400).send({code: 400, data: "Invalid UserId"});
      return;
    }
    return res.status(200).send({
      code: '200',
      data: user.addresses
    })
  }

}
export default UserController;
