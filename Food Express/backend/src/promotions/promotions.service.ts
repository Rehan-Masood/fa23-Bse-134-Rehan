import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivePromotions() {
    return this.prisma.promotion.findMany({
      where: {
        isActive: true,
        expiryDate: {
          gte: new Date(),
        },
      },
      orderBy: { expiryDate: 'asc' },
    });
  }

  async validatePromo(code: string, subtotal: number) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promotion || !promotion.isActive || promotion.expiryDate < new Date()) {
      throw new NotFoundException('Promotion code is invalid or expired');
    }

    if (subtotal < promotion.minOrderAmount) {
      throw new BadRequestException(`Minimum order amount is ${promotion.minOrderAmount}`);
    }

    const discount =
      promotion.type === 'PERCENTAGE'
        ? Math.min(subtotal, (subtotal * promotion.value) / 100)
        : Math.min(subtotal, promotion.value);

    return {
      promotion,
      discount,
    };
  }
}
