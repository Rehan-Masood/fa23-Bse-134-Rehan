import { Body, Controller, Get, Post } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  async getActivePromotions() {
    return this.promotionsService.getActivePromotions();
  }

  @Post('validate')
  async validatePromo(@Body('code') code: string, @Body('subtotal') subtotal: number) {
    return this.promotionsService.validatePromo(code, subtotal);
  }
}
