import { Controller, Get } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private disovery: DiscoveryService) {}

  @Get()
  async findDevices() {
    console.log('get connected devices');
    return await this.disovery.getDevices();
  }
}
