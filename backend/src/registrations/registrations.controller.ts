import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  create(@Body() dto: CreateRegistrationDto) {
    return this.registrationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.registrationsService.findAll();
  }

  @Get('count')
  count() {
    return this.registrationsService.count();
  }
}
