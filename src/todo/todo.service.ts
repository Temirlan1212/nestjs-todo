import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class TodoService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createTodoDto: CreateTodoDto) {
    await this.validateOnTodoExist(createTodoDto);
    return await this.prismaService.todo.create({
      data: createTodoDto,
    });
  }

  async findAll() {
    return await this.prismaService.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const todo = await this.prismaService.todo.findUnique({
      where: { id: String(id) },
    });
    if (!todo) throw new NotFoundException('Todo Not Found');
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    await this.validateOnTodoNotExist(id);
    await this.prismaService.todo.update({
      where: { id: String(id) },
      data: updateTodoDto,
    });
    return { message: 'Todo is updated!', payload: updateTodoDto };
  }

  async remove(id: string) {
    await this.validateOnTodoNotExist(id);
    await this.prismaService.todo.delete({ where: { id } });
    return { message: 'Todo is deleted!', id };
  }

  private async validateOnTodoNotExist(id: string) {
    return await this.findOne(id);
  }

  private async validateOnTodoExist({ label }: CreateTodoDto) {
    const todo = await this.prismaService.todo.findFirst({
      where: { label },
    });
    if (todo) throw new NotFoundException('Such Todo Already Created');
  }
}
