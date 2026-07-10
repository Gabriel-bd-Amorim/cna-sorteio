import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegistrationDto) {
    const existing = await this.prisma.registration.findFirst({
      where: { whatsapp: dto.whatsapp },
    });

    if (existing) {
      throw new ConflictException('Este número de WhatsApp já está cadastrado');
    }

    return this.prisma.registration.create({ data: dto });
  }

  async findAll() {
    return this.prisma.registration.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async count() {
    const total = await this.prisma.registration.count();
    return { total };
  }
}
