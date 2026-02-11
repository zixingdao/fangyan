import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '@changsha/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    // Note: Password hashing should be done here or in auth service
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findByStudentId(student_id: string) {
    return this.usersRepository.findOne({ 
      where: { student_id },
      select: ['id', 'student_id', 'password', 'name', 'role', 'status'] // 需要密码验证
    });
  }

  async updatePasswordHash(id: number, password: string) {
    await this.usersRepository.update({ id }, { password });
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }

  async incrementTotalDuration(id: number, duration: number) {
    return this.usersRepository.increment({ id }, 'total_duration', duration);
  }

  async incrementDuration(id: number, duration: number, type: 'solo' | 'dialogue') {
    await this.usersRepository.increment({ id }, 'total_duration', duration);
    if (type === 'solo') {
      await this.usersRepository.increment({ id }, 'solo_duration', duration);
    } else {
      await this.usersRepository.increment({ id }, 'dialogue_duration', duration);
    }
  }

  async incrementAnnotationDuration(id: number, duration: number) {
    return this.usersRepository.increment({ id }, 'annotation_duration', duration);
  }
}
