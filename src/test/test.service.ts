import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './test.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
  ) {}

  async create(testData: Partial<Test>): Promise<Test> {
    const newTest = this.testRepository.create(testData);
    return await this.testRepository.save(newTest);
  }

  async findAll(): Promise<Test[]> {
    return await this.testRepository.find();
  }
}
