import { IsEmail, IsString, MinLength, IsOptional, Matches, IsBoolean } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email!: string

  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\s\-().]*$/, {
    message: 'Phone must be a valid phone number format'
  })
  phone?: string

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string

  @IsString()
  confirmPassword!: string

  @IsOptional()
  @IsString()
  deliveryAddress?: string
}

export class LoginDto {
  @IsEmail()
  email!: string

  @IsString()
  password!: string

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean
}

export class AuthResponseDto {
  id!: string
  email!: string
  name!: string
  role!: string
  accessToken!: string
  refreshToken?: string
}
