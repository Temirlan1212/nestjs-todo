import { Todo as TodoModule } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class TodoEntity implements TodoModule {
  createdAt: Date;
  updatedAt: Date;
  @IsNotEmpty({
    message: 'Label should not be empty',
  })
  label: string;
  id: string;
  done: boolean;
}
