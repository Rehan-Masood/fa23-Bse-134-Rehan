import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(@Query('restaurantId') restaurantId?: string) {
    return this.categoriesService.getAll(restaurantId);
  }
}
