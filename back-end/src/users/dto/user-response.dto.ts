import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty(
    {
      description: 'First Name',
      type: String
    }
  )
  firstName: string;

  @Expose()
  @ApiProperty(
    {
      description: 'Last Name',
      type: String
    }
  )
  lastName: string;

  @Expose()
  @ApiProperty(
    {
      description: 'Role',
      type: String
    }
  )
  role: string;

  @Expose()
  @ApiProperty(
    {
      description: 'Email',
      type: String
    }
  )
  email: string;
}

@Expose()
export class UserManyResponseDto {
  @ApiProperty(
    {
      description: 'List of users',
      type: Array<UserResponseDto>
    }
  )
  @Type(() => UserResponseDto)
  data: UserResponseDto[];
}
