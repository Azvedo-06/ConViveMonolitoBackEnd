import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'A mensagem não pode ser vazia.' })
  message!: string;
}
