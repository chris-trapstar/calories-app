import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class FoodResponseDto {
  @Expose()
  id: number;

  @Expose()
  @ApiProperty(
    {
      description: 'Name',
      type: String
    }
  )
  name: String;

  @Expose()
  @ApiProperty(
    {
      description: 'Calories',
      type: Number
    }
  )
  calorieValue: Number;

  @Expose()
  @ApiProperty(
    {
      description: 'Taken Date Time',
      type: Date
    }
  )
  takenDateTime: Date;

  @Expose()
  @ApiProperty(
    {
      description: 'User Id',
      type: Number
    }
  )
  userId?: Number;

  @ApiProperty(
    {
      description: 'Price',
      type: Number
    }
  )
  @Expose()
  price: Number
}

@Expose()
export class FoodManyResponseDTO {
  @ApiProperty(
    {
      description: 'List of food items',
      type: Array<FoodResponseDto>
    }
  )
  @Type(() => FoodResponseDto)
  data: FoodResponseDto[];
}
