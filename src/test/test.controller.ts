import { Controller, Post, Get, Body } from '@nestjs/common';
import { TestService } from './test.service';
import { Test } from './test.entity';

@Controller('tests') //  Ensure route name is correct
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  async create(@Body() testData: Partial<Test>): Promise<Test> {
    return this.testService.create(testData);
  }

  @Get()
  async findAll(): Promise<Test[]> {
    return this.testService.findAll();
  }
}
