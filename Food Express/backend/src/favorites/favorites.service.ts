import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getUserFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        restaurant: true,
        menuItem: {
          include: { restaurant: true },
        },
      },
    });

    return {
      restaurants: favorites.filter((f) => f.restaurantId && !f.menuItemId).map((f) => f.restaurant),
      menuItems: favorites.filter((f) => f.menuItemId).map((f) => f.menuItem),
    };
  }

  async addRestaurantFavorite(userId: string, restaurantId: string) {
    // Check if restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Check if already favorite
    const existing = await this.prisma.favorite.findFirst({
      where: {
        userId,
        restaurantId,
        menuItemId: null,
      },
    });

    if (existing) {
      throw new BadRequestException('Restaurant already in favorites');
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        restaurantId,
      },
      include: { restaurant: true },
    });
  }

  async addMenuItemFavorite(userId: string, menuItemId: string) {
    // Check if menu item exists
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: { restaurant: true },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    // Check if already favorite
    const existing = await this.prisma.favorite.findFirst({
      where: {
        userId,
        menuItemId,
      },
    });

    if (existing) {
      throw new BadRequestException('Menu item already in favorites');
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        menuItemId,
      },
      include: {
        menuItem: {
          include: { restaurant: true },
        },
      },
    });
  }

  async removeFavorite(favoriteId: string, userId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { id: favoriteId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    if (favorite.userId !== userId) {
      throw new BadRequestException('Cannot delete another user\'s favorite');
    }

    return this.prisma.favorite.delete({
      where: { id: favoriteId },
    });
  }

  async removeRestaurantFavorite(restaurantId: string, userId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        restaurantId,
        menuItemId: null,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Restaurant not in favorites');
    }

    return this.prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }

  async removeMenuItemFavorite(menuItemId: string, userId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        menuItemId,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Menu item not in favorites');
    }

    return this.prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }
}
