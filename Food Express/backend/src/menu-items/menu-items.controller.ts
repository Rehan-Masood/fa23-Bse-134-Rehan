import { Controller, Get, Param, Query } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  async getAll(
    @Query('restaurantId') restaurantId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.menuItemsService.getAll(restaurantId, categoryId, search);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.menuItemsService.getById(id);
  }
}
