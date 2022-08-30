import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  @ApiProperty(
    {
      description: 'Name',
      type: String
    }
  )
  name: String;

  @IsNumber()
  @ApiProperty(
    {
      description: 'Calories',
      type: Number
    }
  )
  calorieValue: Number;
}
