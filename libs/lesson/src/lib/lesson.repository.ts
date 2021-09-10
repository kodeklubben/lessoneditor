import { EntityRepository, Repository } from 'typeorm';
import { User } from "../../../user/src/lib/user.entity"

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
}