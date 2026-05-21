import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(restaurantId?: string) {
    return this.prisma.category.findMany({
      where: restaurantId ? { restaurantId } : undefined,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}
