import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateEventDto, organizerId: string) {
    return this.prisma.event.create({ data: { ...dto, organizerId } });
  }

  findAll() {
    return this.prisma.event.findMany({ orderBy: { date: 'asc' } });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Evento ${id} não encontrado`);
    }
    return event;
  }

  async update(id: string, dto: UpdateEventDto, organizerId: string) {
    const event = await this.findOne(id);
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You can only update your own events');
    }
    return this.prisma.event.update({ where: { id }, data: dto });
  }

  async remove(id: string, organizerId: string) {
    const event = await this.findOne(id);
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You can only delete your own events');
    }
    return this.prisma.event.delete({ where: { id } });
  }
}
