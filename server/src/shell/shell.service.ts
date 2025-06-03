import { Injectable, Logger } from '@nestjs/common';
import { ShellOrder } from './shell.dto';
import { apiClient } from './api.client';
@Injectable()
export class ShellService {
  private logger = new Logger(ShellService.name);

  constructor() {}

  async execute(order: ShellOrder) {
    this.logger.log(order);
    const data = {
      command: order.command,
    };
    this.logger.log(`http://${order.host}:3002/api/v1/shell`);
    try {
      return (
        await apiClient.post(`http://${order.host}:3002/api/v1/shell`, data)
      ).data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
