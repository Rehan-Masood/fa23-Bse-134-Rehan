import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorator';
import { FavoritesService } from './favorites.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user favorites' })
  async getUserFavorites(@GetUser() user: User) {
    return this.favoritesService.getUserFavorites(user.id);
  }

  @Post('restaurant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add restaurant to favorites' })
  async addRestaurantFavorite(
    @Body('restaurantId') restaurantId: string,
    @GetUser() user: User,
  ) {
    return this.favoritesService.addRestaurantFavorite(user.id, restaurantId);
  }

  @Post('menu-item')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add menu item to favorites' })
  async addMenuItemFavorite(@Body('menuItemId') menuItemId: string, @GetUser() user: User) {
    return this.favoritesService.addMenuItemFavorite(user.id, menuItemId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove favorite' })
  async removeFavorite(@Param('id') favoriteId: string, @GetUser() user: User) {
    return this.favoritesService.removeFavorite(favoriteId, user.id);
  }

  @Delete('restaurant/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove restaurant from favorites' })
  async removeRestaurantFavorite(@Param('id') restaurantId: string, @GetUser() user: User) {
    return this.favoritesService.removeRestaurantFavorite(restaurantId, user.id);
  }

  @Delete('menu-item/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove menu item from favorites' })
  async removeMenuItemFavorite(@Param('id') menuItemId: string, @GetUser() user: User) {
    return this.favoritesService.removeMenuItemFavorite(menuItemId, user.id);
  }
}
