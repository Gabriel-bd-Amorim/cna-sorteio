import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { RegistrationsService } from "./registrations.service";
import { CreateRegistrationDto } from "./dto/create-registration.dto";

@Controller("registrations")
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

  @Get("count")
  count() {
    return this.registrationsService.count();
  }

  @Get("export-excel")
  async exportExcel(@Res({ passthrough: true }) response: Response) {
    const buffer = await this.registrationsService.exportToExcel();

    response.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    response.setHeader(
      "Content-Disposition",
      'attachment; filename="registrations.xlsx"',
    );

    return Buffer.from(buffer);
  }
}
