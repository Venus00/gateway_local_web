import { Body, Controller, Post } from '@nestjs/common';
import { ShellService } from './shell.service';
import { ShellOrder } from './shell.dto';

@Controller('shell')
export class ShellController {
  constructor(private shellService: ShellService) {}
  @Post()
  async execute(@Body() shellOrder: ShellOrder) {
    return await this.shellService.execute(shellOrder);
  }
}
