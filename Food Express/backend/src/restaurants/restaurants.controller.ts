import { Controller, Get, Param, Query } from '@nestjs/common'
import { RestaurantsService } from './restaurants.service'

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  async getAll(
    @Query('search') search?: string,
    @Query('cuisine') cuisine?: string
  ) {
    return this.restaurantsService.getAll(search, cuisine)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.restaurantsService.getById(id)
  }

  @Get(':id/menu')
  async getMenu(@Param('id') id: string) {
    return this.restaurantsService.getMenu(id)
  }
}
