import { Injectable } from '@nestjs/common';

@Injectable()
export class ReservationsService {
  async getUserReservations(_userId: string) {
    return [];
  }
}
