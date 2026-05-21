import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        menuItem: {
          include: {
            restaurant: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const deliveryFee = items.length > 0 ? 299 : 0;
    const discount = 0;

    return {
      items,
      subtotal,
      deliveryFee,
      discount,
      total: subtotal + deliveryFee - discount,
    };
  }

  async addItem(userId: string, menuItemId: string, quantity = 1) {
    if (!menuItemId) {
      throw new BadRequestException('menuItemId is required');
    }

    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem || !menuItem.isAvailable) {
      throw new NotFoundException('Menu item is not available');
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_menuItemId: {
          userId,
          menuItemId,
        },
      },
    });

    if (existingItem) {
      return this.updateQuantity(existingItem.id, existingItem.quantity + Math.max(1, quantity), userId);
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        menuItemId,
        quantity: Math.max(1, quantity),
      },
      include: {
        menuItem: true,
      },
    });
  }

  async updateQuantity(cartItemId: string, quantity: number, userId: string) {
    if (quantity < 1) {
      return this.removeItem(cartItemId, userId);
    }

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        menuItem: true,
      },
    });
  }

  async removeItem(cartItemId: string, userId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return { message: 'Cart item removed' };
  }
}
