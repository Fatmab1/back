import { Controller, Get } from '@nestjs/common';
import { FactoryService } from './factory.service';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get('tree')
  async getFullTree() {
    return this.factoryService.getFullTree();
  }
}
