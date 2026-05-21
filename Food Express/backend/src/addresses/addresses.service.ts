import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async getUserAddresses(userId: string) {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async getAddressById(addressId: string, userId: string) {
    const address = await this.prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new BadRequestException('Cannot access another user\'s address');
    }

    return address;
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    // If marking as default, unset other defaults
    if (createAddressDto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.create({
      data: {
        userId,
        ...createAddressDto,
      },
    });
  }

  async updateAddress(addressId: string, userId: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new BadRequestException('Cannot update another user\'s address');
    }

    // If marking as default, unset other defaults
    if (updateAddressDto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.update({
      where: { id: addressId },
      data: updateAddressDto,
    });
  }

  async deleteAddress(addressId: string, userId: string) {
    const address = await this.prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new BadRequestException('Cannot delete another user\'s address');
    }

    return this.prisma.userAddress.delete({
      where: { id: addressId },
    });
  }

  async setDefaultAddress(addressId: string, userId: string) {
    const address = await this.prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new BadRequestException('Cannot update another user\'s address');
    }

    // Unset all other defaults
    await this.prisma.userAddress.updateMany({
      where: { userId, id: { not: addressId } },
      data: { isDefault: false },
    });

    // Set this one as default
    return this.prisma.userAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
