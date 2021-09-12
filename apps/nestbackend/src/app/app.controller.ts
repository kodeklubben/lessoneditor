import {  Controller, Request, Post, UseGuards, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import {Connection} from "typeorm"
import { Repository } from "typeorm";
import { User } from "../../../../libs/user/src/lib/user.entity";
import { UserService } from "libs/user/src/lib/user.service";


@Controller()
export class AppController {
  

  @Get()
  async GetUsers(): Promise<void>
  {

  }


}
