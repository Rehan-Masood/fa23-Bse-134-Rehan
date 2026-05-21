import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { User } from '@prisma/client'
import { UsersService } from './users.service'
import { GetUser } from '../common/decorators/get-user.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser() user: User) {
    return this.usersService.getProfile(user.id)
  }
}
