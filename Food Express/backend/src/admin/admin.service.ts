import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [totalOrders, users, restaurants, revenue, recentOrders, topRestaurants, statusGroups] =
      await Promise.all([
        this.prisma.order.count(),
        this.prisma.user.count(),
        this.prisma.restaurant.count(),
        this.prisma.order.aggregate({ _sum: { totalAmount: true } }),
        this.getAllOrders(10),
        this.prisma.restaurant.findMany({
          take: 5,
          orderBy: { rating: 'desc' },
          include: {
            _count: {
              select: { orders: true },
            },
          },
        }),
        this.prisma.order.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
      ]);

    const monthlyOrders = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const monthlyRevenue = await this.prisma.order.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { totalAmount: true },
    });

    return {
      totalOrders,
      totalRevenue: revenue._sum.totalAmount || 0,
      totalUsers: users,
      totalRestaurants: restaurants,
      users,
      restaurants,
      monthlyOrders,
      monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
      recentOrders,
      topRestaurants,
      orderStatusChart: statusGroups.map((group) => ({
        status: group.status,
        count: group._count.status,
      })),
      revenueChart: this.makeRevenueChart(),
    };
  }

  async getAllOrders(take?: number) {
    return this.prisma.order.findMany({
      take,
      include: {
        user: true,
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        deliveryAssignment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllRestaurants() {
    return this.prisma.restaurant.findMany({
      include: {
        categories: true,
        _count: {
          select: {
            menuItems: true,
            orders: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRestaurant(data: any) {
    return this.prisma.restaurant.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        rating: Number(data.rating || 0),
        deliveryTimeMin: Number(data.deliveryTimeMin || 25),
        deliveryTimeMax: Number(data.deliveryTimeMax || 45),
        minOrderAmount: Number(data.minOrderAmount || 0),
        address: data.address,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateRestaurant(id: string, data: any) {
    await this.ensureRestaurant(id);
    return this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  async deleteRestaurant(id: string) {
    await this.ensureRestaurant(id);
    return this.prisma.restaurant.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        restaurant: true,
      },
    });
  }

  // Menu Items Management
  async getMenuItems(restaurantId?: string) {
    return this.prisma.menuItem.findMany({
      where: restaurantId ? { restaurantId } : undefined,
      include: {
        restaurant: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMenuItem(data: any) {
    // Verify restaurant and category exist
    await Promise.all([
      this.ensureRestaurant(data.restaurantId),
      this.ensureCategory(data.categoryId),
    ]);

    return this.prisma.menuItem.create({
      data: {
        restaurantId: data.restaurantId,
        categoryId: data.categoryId,
        name: data.name,
        price: Number(data.price),
        description: data.description,
        imageUrl: data.imageUrl || '',
        isAvailable: data.isAvailable ?? true,
      },
      include: {
        restaurant: true,
        category: true,
      },
    });
  }

  async updateMenuItem(id: string, data: any) {
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        name: data.name || menuItem.name,
        price: data.price ? Number(data.price) : menuItem.price,
        description: data.description || menuItem.description,
        imageUrl: data.imageUrl || menuItem.imageUrl,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : menuItem.isAvailable,
        categoryId: data.categoryId || menuItem.categoryId,
      },
      include: {
        restaurant: true,
        category: true,
      },
    });
  }

  async deleteMenuItem(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return this.prisma.menuItem.delete({ where: { id } });
  }

  // Categories Management
  async getCategories(restaurantId?: string) {
    return this.prisma.category.findMany({
      where: restaurantId ? { restaurantId } : undefined,
      include: {
        restaurant: true,
        menuItems: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(data: any) {
    await this.ensureRestaurant(data.restaurantId);

    return this.prisma.category.create({
      data: {
        restaurantId: data.restaurantId,
        name: data.name,
        description: data.description || '',
      },
      include: {
        restaurant: true,
        menuItems: true,
      },
    });
  }

  async updateCategory(id: string, data: any) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name || category.name,
        description: data.description !== undefined ? data.description : category.description,
      },
      include: {
        restaurant: true,
        menuItems: true,
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.delete({ where: { id } });
  }

  // Promotions Management
  async getPromotions() {
    return this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPromotion(data: any) {
    return this.prisma.promotion.create({
      data: {
        code: data.code,
        type: data.type,
        value: Number(data.value),
        expiryDate: new Date(data.expiryDate),
        minOrderAmount: Number(data.minOrderAmount || 0),
        isActive: data.isActive ?? true,
      },
    });
  }

  async updatePromotion(id: string, data: any) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    return this.prisma.promotion.update({
      where: { id },
      data: {
        code: data.code || promotion.code,
        type: data.type || promotion.type,
        value: data.value ? Number(data.value) : promotion.value,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : promotion.expiryDate,
        minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : promotion.minOrderAmount,
        isActive: data.isActive !== undefined ? data.isActive : promotion.isActive,
      },
    });
  }

  async deletePromotion(id: string) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    return this.prisma.promotion.delete({ where: { id } });
  }

  // Reviews Management
  async getReviews() {
    return this.prisma.review.findMany({
      include: {
        user: true,
        restaurant: true,
        menuItem: true,
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.delete({ where: { id } });
  }

  private async ensureCategory(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private async ensureRestaurant(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
  }

  private makeRevenueChart() {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((label, index) => ({
      label,
      revenue: [9500, 14200, 11800, 10500, 16600, 15800, 21400][index],
    }));
  }
}
