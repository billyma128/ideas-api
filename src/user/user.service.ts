import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO, UserRO } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(): Promise<UserRO[]> {
    const uesrs = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
    });
    return uesrs.map(user => user.toResponseObject(false));
  }

  async login(data: UserDTO): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.NOT_FOUND,
      );
    }

    return user.toResponseObject();
  }

  async register(data: UserDTO): Promise<UserRO> {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
