import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: this.orderInclude(),
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.serializeOrder(order));
  }

  async getOrderById(id: string, userId: string, role: Role = Role.CUSTOMER) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: this.orderInclude(),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return this.serializeOrder(order);
  }

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const { deliveryAddress, items, restaurantId, promoCode } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: items.map((item) => item.menuItemId) },
        isAvailable: true,
      },
    });

    if (menuItems.length !== items.length) {
      throw new BadRequestException('One or more menu items are unavailable');
    }

    const resolvedRestaurantId = restaurantId || menuItems[0].restaurantId;
    const invalidRestaurantItem = menuItems.find((item) => item.restaurantId !== resolvedRestaurantId);

    if (invalidRestaurantItem) {
      throw new BadRequestException('All order items must belong to the same restaurant');
    }

    const menuItemById = new Map(menuItems.map((item) => [item.id, item]));
    const subtotal = items.reduce((sum, item) => {
      const menuItem = menuItemById.get(item.menuItemId);
      return sum + (menuItem?.price || item.price) * item.quantity;
    }, 0);

    const deliveryFee = 299;
    const discount = await this.calculateDiscount(promoCode, subtotal);
    const totalAmount = subtotal + deliveryFee - discount;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId: resolvedRestaurantId,
        deliveryAddress,
        deliveryFee,
        discount,
        totalAmount,
        orderNumber,
        status: OrderStatus.PENDING,
        notes: createOrderDto.notes,
        estimatedDeliveryTime: new Date(Date.now() + 35 * 60000),
        orderItems: {
          createMany: {
            data: items.map((item) => {
              const menuItem = menuItemById.get(item.menuItemId);
              return {
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: menuItem?.price || item.price,
                name: menuItem?.name || item.name,
              };
            }),
          },
        },
        deliveryAssignment: {
          create: {
            status: 'AVAILABLE',
            fee: deliveryFee,
          },
        },
      },
      include: this.orderInclude(),
    });

    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return this.serializeOrder(order);
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: this.orderInclude(),
    });

    return this.serializeOrder(updatedOrder);
  }

  private async calculateDiscount(promoCode: string | undefined, subtotal: number) {
    if (!promoCode) {
      return 0;
    }

    const promotion = await this.prisma.promotion.findUnique({
      where: { code: promoCode.toUpperCase() },
    });

    if (!promotion || !promotion.isActive || promotion.expiryDate < new Date()) {
      throw new BadRequestException('Promotion code is invalid or expired');
    }

    if (subtotal < promotion.minOrderAmount) {
      throw new BadRequestException(`Minimum order amount is ${promotion.minOrderAmount}`);
    }

    return promotion.type === 'PERCENTAGE'
      ? Math.min(subtotal, (subtotal * promotion.value) / 100)
      : Math.min(subtotal, promotion.value);
  }

  private orderInclude() {
    return {
      orderItems: {
        include: {
          menuItem: true,
        },
      },
      restaurant: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      deliveryAssignment: {
        include: {
          deliveryPerson: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    };
  }

  private serializeOrder(order: any) {
    const subtotal = order.orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const tax = 0;

    return {
      ...order,
      items: order.orderItems,
      subtotal,
      tax,
      total: order.totalAmount,
      totalAmount: order.totalAmount,
      paymentMethod: 'cod',
      deliveryPhone: order.user?.phone || '',
    };
  }
}
