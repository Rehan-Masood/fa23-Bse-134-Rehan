import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'))
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  async getUserReservations(@GetUser() user: User) {
    return this.reservationsService.getUserReservations(user.id);
  }
}
