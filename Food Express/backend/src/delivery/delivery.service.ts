import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryStatus, OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableOrders() {
    return this.prisma.deliveryAssignment.findMany({
      where: {
        status: DeliveryStatus.AVAILABLE,
        deliveryPersonId: null,
      },
      include: this.assignmentInclude(),
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptOrder(orderId: string, userId: string) {
    const deliveryPerson = await this.getDeliveryPerson(userId);
    const assignment = await this.prisma.deliveryAssignment.findUnique({
      where: { orderId },
    });

    if (!assignment || assignment.deliveryPersonId) {
      throw new BadRequestException('Delivery request is no longer available');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.ASSIGNED },
      });

      await tx.deliveryPerson.update({
        where: { id: deliveryPerson.id },
        data: {
          status: DeliveryStatus.ACCEPTED,
          isOnline: true,
        },
      });

      return tx.deliveryAssignment.update({
        where: { orderId },
        data: {
          deliveryPersonId: deliveryPerson.id,
          status: DeliveryStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
        include: this.assignmentInclude(),
      });
    });
  }

  async rejectOrder(orderId: string, userId: string) {
    await this.getDeliveryPerson(userId);
    const assignment = await this.prisma.deliveryAssignment.findUnique({ where: { orderId } });

    if (!assignment || assignment.deliveryPersonId) {
      throw new BadRequestException('Delivery request is no longer available');
    }

    return this.prisma.deliveryAssignment.update({
      where: { orderId },
      data: {
        status: DeliveryStatus.AVAILABLE,
        rejectedAt: new Date(),
      },
      include: this.assignmentInclude(),
    });
  }

  async updateStatus(orderId: string, userId: string, status: DeliveryStatus) {
    const deliveryPerson = await this.getDeliveryPerson(userId);
    const assignment = await this.prisma.deliveryAssignment.findUnique({
      where: { orderId },
    });

    if (!assignment) {
      throw new NotFoundException('Delivery assignment not found');
    }

    if (assignment.deliveryPersonId !== deliveryPerson.id) {
      throw new ForbiddenException('This delivery is assigned to another driver');
    }

    const orderStatusByDeliveryStatus: Partial<Record<DeliveryStatus, OrderStatus>> = {
      ACCEPTED: OrderStatus.ASSIGNED,
      PICKED_UP: OrderStatus.PICKED_UP,
      OUT_FOR_DELIVERY: OrderStatus.OUT_FOR_DELIVERY,
      DELIVERED: OrderStatus.DELIVERED,
      FAILED: OrderStatus.CANCELLED,
      CANCELLED: OrderStatus.CANCELLED,
    };

    return this.prisma.$transaction(async (tx) => {
      if (orderStatusByDeliveryStatus[status]) {
        await tx.order.update({
          where: { id: orderId },
          data: { status: orderStatusByDeliveryStatus[status] },
        });
      }

      const assignmentUpdate: any = { status };
      if (status === DeliveryStatus.PICKED_UP) assignmentUpdate.pickedUpAt = new Date();
      if (status === DeliveryStatus.DELIVERED) assignmentUpdate.deliveredAt = new Date();

      if (status === DeliveryStatus.DELIVERED) {
        await tx.deliveryPerson.update({
          where: { id: deliveryPerson.id },
          data: {
            status: DeliveryStatus.AVAILABLE,
            completedOrders: { increment: 1 },
            totalEarnings: { increment: assignment.fee },
          },
        });
      } else {
        await tx.deliveryPerson.update({
          where: { id: deliveryPerson.id },
          data: { status },
        });
      }

      return tx.deliveryAssignment.update({
        where: { orderId },
        data: assignmentUpdate,
        include: this.assignmentInclude(),
      });
    });
  }

  async getEarnings(userId: string) {
    const deliveryPerson = await this.getDeliveryPerson(userId);
    const deliveredAssignments = await this.prisma.deliveryAssignment.findMany({
      where: {
        deliveryPersonId: deliveryPerson.id,
        status: DeliveryStatus.DELIVERED,
      },
      orderBy: { deliveredAt: 'desc' },
    });

    return {
      totalEarnings: deliveryPerson.totalEarnings,
      ordersCompleted: deliveryPerson.completedOrders,
      distance: `${Math.max(0, deliveredAssignments.length * 7.7).toFixed(1)} km`,
      onlineHours: `${Math.max(1, deliveredAssignments.length * 0.7).toFixed(1)}h`,
      history: deliveredAssignments,
    };
  }

  async getHistory(userId: string) {
    const deliveryPerson = await this.getDeliveryPerson(userId);

    return this.prisma.deliveryAssignment.findMany({
      where: { deliveryPersonId: deliveryPerson.id },
      include: this.assignmentInclude(),
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProfile(userId: string) {
    return this.getDeliveryPerson(userId);
  }

  async updateProfile(userId: string, data: any) {
    const deliveryPerson = await this.getDeliveryPerson(userId);

    return this.prisma.deliveryPerson.update({
      where: { id: deliveryPerson.id },
      data: {
        isOnline: data.isOnline,
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber,
      },
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
    });
  }

  private async getDeliveryPerson(userId: string) {
    const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
      where: { userId },
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
    });

    if (!deliveryPerson) {
      throw new NotFoundException('Delivery profile not found');
    }

    return deliveryPerson;
  }

  private assignmentInclude() {
    return {
      order: {
        include: {
          restaurant: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          orderItems: true,
        },
      },
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
    };
  }
}
