import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getUserCart(@GetUser() user: User) {
    return this.cartService.getUserCart(user.id);
  }

  @Post('add')
  async addItem(
    @Body('menuItemId') menuItemId: string,
    @Body('quantity') quantity: number,
    @GetUser() user: User,
  ) {
    return this.cartService.addItem(user.id, menuItemId, quantity);
  }

  @Patch(':id')
  async updateQuantity(
    @Param('id') cartItemId: string,
    @Body('quantity') quantity: number,
    @GetUser() user: User,
  ) {
    return this.cartService.updateQuantity(cartItemId, quantity, user.id);
  }

  @Delete(':id')
  async removeItem(@Param('id') cartItemId: string, @GetUser() user: User) {
    return this.cartService.removeItem(cartItemId, user.id);
  }
}
