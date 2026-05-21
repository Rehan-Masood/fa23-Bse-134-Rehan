import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator'

export class CreateOrderDto {
  @IsString()
  restaurantId!: string

  @IsString()
  deliveryAddress!: string

  @IsString()
  deliveryPhone!: string

  @IsArray()
  items!: OrderItemDto[]

  @IsString()
  paymentMethod!: string

  @IsOptional()
  @IsString()
  promoCode?: string

  @IsOptional()
  @IsString()
  notes?: string
}

export class OrderItemDto {
  @IsString()
  menuItemId!: string

  @IsString()
  name!: string

  @IsNumber()
  quantity!: number

  @IsNumber()
  price!: number
}
