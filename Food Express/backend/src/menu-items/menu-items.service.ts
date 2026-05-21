import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(restaurantId?: string, categoryId?: string, search?: string) {
    return this.prisma.menuItem.findMany({
      where: {
        ...(restaurantId ? { restaurantId } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(search
          ? {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: true,
        category: true,
      },
    });
  }

  async getById(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        restaurant: true,
        category: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }
}
