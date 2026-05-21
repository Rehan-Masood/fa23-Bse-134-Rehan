import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReviews(filters: { menuItemId?: string; restaurantId?: string; orderId?: string }) {
    return this.prisma.review.findMany({
      where: {
        ...(filters.menuItemId ? { menuItemId: filters.menuItemId } : {}),
        ...(filters.restaurantId ? { restaurantId: filters.restaurantId } : {}),
        ...(filters.orderId ? { orderId: filters.orderId } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        restaurant: true,
        menuItem: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(userId: string, data: any) {
    if (!data.restaurantId && !data.menuItemId && !data.orderId) {
      throw new BadRequestException('Review must target a restaurant, menu item, or order');
    }

    const rating = Number(data.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    return this.prisma.review.create({
      data: {
        userId,
        restaurantId: data.restaurantId,
        menuItemId: data.menuItemId,
        orderId: data.orderId,
        rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        restaurant: true,
        menuItem: true,
      },
    });
  }
}
