import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { OrderStatus } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'
import { AdminService } from './admin.service'
import { Roles } from '../common/decorators/roles.decorator'
import { Role } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin dashboard data' })
  async getDashboard() {
    return this.adminService.getDashboard()
  }

  @Get('orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders' })
  async getAllOrders() {
    return this.adminService.getAllOrders()
  }

  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return this.adminService.getAllUsers()
  }

  @Get('restaurants')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all restaurants' })
  async getAllRestaurants() {
    return this.adminService.getAllRestaurants()
  }

  @Post('restaurants')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create restaurant' })
  async createRestaurant(@Body() data: any) {
    return this.adminService.createRestaurant(data)
  }

  @Patch('restaurants/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update restaurant' })
  async updateRestaurant(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateRestaurant(id, data)
  }

  @Delete('restaurants/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete restaurant' })
  async deleteRestaurant(@Param('id') id: string) {
    return this.adminService.deleteRestaurant(id)
  }

  @Patch('orders/:id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.adminService.updateOrderStatus(id, status)
  }

  // Menu Items Management
  @Get('menu-items')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all menu items' })
  async getMenuItems(@Query('restaurantId') restaurantId?: string) {
    return this.adminService.getMenuItems(restaurantId)
  }

  @Post('menu-items')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create menu item' })
  async createMenuItem(@Body() data: any) {
    return this.adminService.createMenuItem(data)
  }

  @Patch('menu-items/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update menu item' })
  async updateMenuItem(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateMenuItem(id, data)
  }

  @Delete('menu-items/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete menu item' })
  async deleteMenuItem(@Param('id') id: string) {
    return this.adminService.deleteMenuItem(id)
  }

  // Categories Management
  @Get('categories')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories' })
  async getCategories(@Query('restaurantId') restaurantId?: string) {
    return this.adminService.getCategories(restaurantId)
  }

  @Post('categories')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category' })
  async createCategory(@Body() data: any) {
    return this.adminService.createCategory(data)
  }

  @Patch('categories/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateCategory(id, data)
  }

  @Delete('categories/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id)
  }

  // Promotions Management
  @Get('promotions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all promotions' })
  async getPromotions() {
    return this.adminService.getPromotions()
  }

  @Post('promotions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create promotion' })
  async createPromotion(@Body() data: any) {
    return this.adminService.createPromotion(data)
  }

  @Patch('promotions/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update promotion' })
  async updatePromotion(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updatePromotion(id, data)
  }

  @Delete('promotions/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete promotion' })
  async deletePromotion(@Param('id') id: string) {
    return this.adminService.deletePromotion(id)
  }

  // Reviews Management
  @Get('reviews')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews' })
  async getReviews() {
    return this.adminService.getReviews()
  }

  @Delete('reviews/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review' })
  async deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id)
  }
}
