import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getReviews(
    @Query('menuItemId') menuItemId?: string,
    @Query('restaurantId') restaurantId?: string,
    @Query('orderId') orderId?: string,
  ) {
    return this.reviewsService.getReviews({ menuItemId, restaurantId, orderId });
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createReview(@Body() data: any, @GetUser() user: User) {
    return this.reviewsService.createReview(user.id, data);
  }
}
