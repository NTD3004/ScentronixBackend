import { IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetServerDto {
  @Transform(({value}) => {
    return !isNaN(value) && !isNaN(parseFloat(value)) ? parseInt(value) : value;
  })
  @IsNotEmpty()
  @IsNumber()
  priority: number;
}