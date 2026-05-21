import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeliveryStatus, User } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Role, Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.DELIVERY_PERSON)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('orders')
  async getAvailableOrders() {
    return this.deliveryService.getAvailableOrders();
  }

  @Post('orders/:id/accept')
  async acceptOrder(@Param('id') orderId: string, @GetUser() user: User) {
    return this.deliveryService.acceptOrder(orderId, user.id);
  }

  @Post('orders/:id/reject')
  async rejectOrder(@Param('id') orderId: string, @GetUser() user: User) {
    return this.deliveryService.rejectOrder(orderId, user.id);
  }

  @Patch('orders/:id/status')
  async updateStatus(
    @Param('id') orderId: string,
    @Body('status') status: DeliveryStatus,
    @GetUser() user: User,
  ) {
    return this.deliveryService.updateStatus(orderId, user.id, status);
  }

  @Get('earnings')
  async getEarnings(@GetUser() user: User) {
    return this.deliveryService.getEarnings(user.id);
  }

  @Get('history')
  async getHistory(@GetUser() user: User) {
    return this.deliveryService.getHistory(user.id);
  }

  @Get('profile')
  async getProfile(@GetUser() user: User) {
    return this.deliveryService.getProfile(user.id);
  }

  @Patch('profile')
  async updateProfile(@GetUser() user: User, @Body() data: any) {
    return this.deliveryService.updateProfile(user.id, data);
  }
}
