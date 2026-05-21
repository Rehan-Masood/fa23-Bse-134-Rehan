import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorator';
import { AddressesService } from './addresses.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(AuthGuard('jwt'))
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user addresses' })
  async getUserAddresses(@GetUser() user: User) {
    return this.addressesService.getUserAddresses(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get address by ID' })
  async getAddressById(@Param('id') addressId: string, @GetUser() user: User) {
    return this.addressesService.getAddressById(addressId, user.id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new address' })
  async createAddress(@Body() createAddressDto: CreateAddressDto, @GetUser() user: User) {
    return this.addressesService.createAddress(user.id, createAddressDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update address' })
  async updateAddress(
    @Param('id') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @GetUser() user: User,
  ) {
    return this.addressesService.updateAddress(addressId, user.id, updateAddressDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete address' })
  async deleteAddress(@Param('id') addressId: string, @GetUser() user: User) {
    return this.addressesService.deleteAddress(addressId, user.id);
  }

  @Patch(':id/set-default')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set address as default' })
  async setDefaultAddress(@Param('id') addressId: string, @GetUser() user: User) {
    return this.addressesService.setDefaultAddress(addressId, user.id);
  }
}
