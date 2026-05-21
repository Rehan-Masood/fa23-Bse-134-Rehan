import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { CategoriesModule } from './categories/categories.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AdminModule } from './admin/admin.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DeliveryModule } from './delivery/delivery.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    CategoriesModule,
    MenuItemsModule,
    CartModule,
    OrdersModule,
    ReservationsModule,
    AdminModule,
    PromotionsModule,
    ReviewsModule,
    DeliveryModule,
    FavoritesModule,
    AddressesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
