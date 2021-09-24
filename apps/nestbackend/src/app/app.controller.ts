import {  Controller, Request, Post, UseGuards, Get, Res } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { AppService } from "./app.service";
import {Connection} from "typeorm"
import { Repository } from "typeorm";
import { User } from "../../../../libs/user/src/lib/user.entity";
import { UserService } from "libs/user/src/lib/user.service";
import { AuthService } from "../../../../libs/auth/src/lib/auth.service";
import { stringify } from "querystring";


@Controller()
export class AppController {

  constructor()
  {}

  
}
