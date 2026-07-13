import { ConflictException, Injectable } from "@nestjs/common";
import * as ExcelJS from "exceljs";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRegistrationDto } from "./dto/create-registration.dto";

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegistrationDto) {
    const existing = await this.prisma.registration.findFirst({
      where: { whatsapp: dto.whatsapp },
    });

    if (existing) {
      throw new ConflictException("Este número de WhatsApp já está cadastrado");
    }

    return this.prisma.registration.create({ data: dto });
  }

  async findAll() {
    return this.prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async count() {
    const total = await this.prisma.registration.count();
    return { total };
  }

  async exportToExcel() {
    const registrations = await this.prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Registrations");

    worksheet.columns = [
      { header: "ID", key: "id", width: 38 },
      { header: "Nome completo", key: "fullName", width: 28 },
      { header: "WhatsApp", key: "whatsapp", width: 18 },
      { header: "E-mail", key: "email", width: 32 },
      { header: "Idioma", key: "language", width: 12 },
      { header: "Criado em", key: "createdAt", width: 24 },
    ];

    worksheet.addRows(
      registrations.map((registration) => ({
        id: registration.id,
        fullName: registration.fullName,
        whatsapp: registration.whatsapp,
        email: registration.email ?? "",
        language: registration.language,
        createdAt: registration.createdAt.toISOString(),
      })),
    );

    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    return workbook.xlsx.writeBuffer();
  }
}
