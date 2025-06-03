import { Module, forwardRef } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { DiscoveryController } from './discovery.controller';

@Module({
  imports:[],
  providers: [DiscoveryService],
  exports:[DiscoveryService],
  controllers: [DiscoveryController]
})
export class DiscoveryModule {}
