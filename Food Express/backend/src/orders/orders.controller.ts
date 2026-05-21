import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { OrderStatus, User } from '@prisma/client'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { GetUser } from '../common/decorators/get-user.decorator'
import { Roles, Role } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserOrders(@GetUser() user: User) {
    return this.ordersService.getUserOrders(user.id)
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getOrderById(@Param('id') id: string, @GetUser() user: User) {
    return this.ordersService.getOrderById(id, user.id, user.role as any)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.createOrder(createOrderDto, user.id)
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status)
  }
}
