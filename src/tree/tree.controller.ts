import { Controller, Get } from '@nestjs/common';
import { TreeService } from './tree.service';

@Controller('tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  @Get()
  async getTree() {
    return this.treeService.getTreeData();
  }
}
