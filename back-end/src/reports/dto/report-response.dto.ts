import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReportResponseDto {
  @Expose()
  @ApiProperty(
    {
      description: '7 days food count',
      type: Number
    }
  )
  lastWeekCount: Number;
  @ApiProperty(
    {
      description: 'Previous week food count',
      type: Number
    }
  )
  previousWeekCount: Number;

  @ApiProperty(
    {
      description: 'Last 7 days calories',
      type: Number
    }
  )
  last7DaysCalories: Number;
}
