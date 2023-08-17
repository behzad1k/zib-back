import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import config from "../config/config";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import * as jwtDecode from "jwt-decode";
import { Service } from "../entity/Service";
import { generateOTPCode, getUserId } from "../utils/funs";
import { roles } from "../utils/roles";

class UserController {
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
      user: user,
      token: newToken
    });
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
    user.hashPassword();
    userRepository.save(user);

    return res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.body;
    const userRepository = getRepository(User);
    try {
      await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(400).send("Invalid id");
      return;
    }
    try {
      await userRepository.delete(id);
    } catch (error) {
      return res.status(409).send("try again later");
    }
    return res.status(204).send();
  };

  static getAddresses = async (req: Request,res: Response): Promise<Response> => {
    const id: number = req.body.id
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    }
    catch (error) {
      res.status(400).send("Invalid id");
      return;
    }
    return res.status(200).send({
      code: '200',
      data: user
    })
  }
}
export default UserController;
