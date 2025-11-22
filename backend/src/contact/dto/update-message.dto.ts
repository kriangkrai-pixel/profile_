import { IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class UpdateMessageDto {
  @IsNotEmpty({ message: 'กรุณาระบุ ID' })
  @IsNumber({}, { message: 'ID ต้องเป็นตัวเลข' })
  id: number;

  @IsNotEmpty({ message: 'กรุณาระบุสถานะการอ่าน' })
  @IsBoolean({ message: 'isRead ต้องเป็น true หรือ false' })
  isRead: boolean;
}

