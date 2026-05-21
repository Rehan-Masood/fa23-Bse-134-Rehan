import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(search?: string, cuisine?: string) {
    return this.prisma.restaurant.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(cuisine && cuisine !== 'All'
          ? {
              categories: {
                some: {
                  name: { contains: cuisine, mode: 'insensitive' },
                },
              },
            }
          : {}),
      },
      include: {
        categories: true,
        menuItems: {
          where: { isAvailable: true },
          take: 4,
          include: { category: true },
        },
        reviews: true,
      },
      orderBy: { rating: 'desc' },
    });
  }

  async getById(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        categories: true,
        menuItems: {
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async getMenu(id: string) {
    await this.getById(id);

    return this.prisma.menuItem.findMany({
      where: {
        restaurantId: id,
        isAvailable: true,
      },
      include: {
        category: true,
      },
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
    });
  }
}
