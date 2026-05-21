import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      // Handle database errors
      this.handleDatabaseError(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword, name, phone } = registerDto;

    // Validate input
    if (!email || !name || !password) {
      throw new BadRequestException('Email, name, and password are required');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    try {
      // Check if user already exists
      let existingUser;
      try {
        existingUser = await this.prisma.user.findUnique({
          where: { email },
        });
      } catch (error) {
        // If table doesn't exist or DB connection issue
        this.handleDatabaseError(error);
      }

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || null,
          role: 'CUSTOMER',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          createdAt: true,
        },
      });

      // Generate token
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);

      return {
        accessToken: token,
        user,
      };
    } catch (error) {
      // Handle database errors during creation
      this.handleDatabaseError(error);
    }
  }

  async logout() {
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }

  /**
   * Handle database errors and provide user-friendly messages
   * @param error Database error from Prisma
   * @throws BadRequestException with appropriate message
   */
  private handleDatabaseError(error: any): never {
    // Check for common database error codes
    if (error.code === 'P1001' || error.message?.includes('ECONNREFUSED')) {
      throw new BadRequestException(
        'Database connection failed. Please ensure PostgreSQL is running and the DATABASE_URL is correct.',
      );
    }

    if (error.code === 'P1003' || error.message?.includes('does not exist')) {
      throw new BadRequestException(
        'Database tables not initialized. Please run: npm run prisma:migrate',
      );
    }

    if (error.code === 'P2002') {
      throw new ConflictException('This email is already registered');
    }

    if (error.code === 'P2025') {
      throw new UnauthorizedException('User not found');
    }

    // Log the actual error for debugging
    console.error('Database error:', error);

    throw new BadRequestException(
      'A database error occurred. Please check the server logs and ensure migrations are run.',
    );
  }
}
