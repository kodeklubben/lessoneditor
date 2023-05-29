import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionEntity } from "./session.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class SessionModule {}
