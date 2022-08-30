import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty(
    {
      description: 'First Name',
      type: String
    }
  )
  firstName: string;

  @IsString()
  @ApiProperty(
    {
      description: 'Last Name',
      type: String
    }
  )
  lastName: string;

  @IsString()
  @ApiProperty(
    {
      description: 'Role',
      type: String
    }
  )
  role: string;

  @IsString()
  @ApiProperty(
    {
      description: 'Email',
      type: String
    }
  )
  email: string;

  @IsString()
  @ApiProperty(
    {
      description: 'Password',
      type: String
    }
  )
  password: string;
}
