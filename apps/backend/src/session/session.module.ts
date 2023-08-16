import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./session.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class SessionModule {}
