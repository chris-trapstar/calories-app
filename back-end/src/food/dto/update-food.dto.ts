import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsNumber, IsDate } from 'class-validator';

export class UpdateFoodDto {
  @IsDefined()
  @IsString()
  @ApiProperty(
    {
      description: 'Name',
      type: String
    }
  )
  name: String;

  @IsDefined()
  @IsNumber()
  @ApiProperty(
    {
      description: 'Calories',
      type: Number
    }
  )
  calorieValue: Number;
}
