import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RaffleService {
  constructor(private readonly prisma: PrismaService) {}

  // Lista todos os participantes (usada no front para exibir/animar o sorteio)
  async participants() {
    return this.prisma.registration.findMany({
      select: { id: true, fullName: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Sorteia um participante, sem repetir quem já ganhou (onlyNewWinners = true por padrão)
  async draw(onlyNewWinners = true) {
    const previousWinnersIds = onlyNewWinners
      ? (await this.prisma.draw.findMany({ select: { registrationId: true } })).map(
          (d) => d.registrationId,
        )
      : [];

    const candidates = await this.prisma.registration.findMany({
      where: onlyNewWinners ? { id: { notIn: previousWinnersIds } } : {},
    });

    if (candidates.length === 0) {
      throw new BadRequestException(
        'Não há participantes disponíveis para o sorteio',
      );
    }

    const winner = candidates[Math.floor(Math.random() * candidates.length)];

    const draw = await this.prisma.draw.create({
      data: { registrationId: winner.id },
      include: { registration: true },
    });

    return draw;
  }

  async history() {
    return this.prisma.draw.findMany({
      include: { registration: true },
      orderBy: { drawnAt: 'desc' },
    });
  }
}
