import {  Controller, Request, Post, UseGuards, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import {Connection} from "typeorm"
import { Repository } from "typeorm";
import { User } from "../../../../libs/user/src/lib/user.entity";


@Controller()
export class AppController {
  private userRepository: Repository<User>
  constructor(private readonly appService: AppService, private connection: Connection) {
    this.userRepository = connection.getRepository(User);

  }

  @Get()
  async GetUsers(): Promise<User[]>
  {
    return await this.userRepository.find();

  }


}
