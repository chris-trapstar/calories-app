import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  Override,
} from '@nestjsx/crud';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUser } from 'src/auth/get-user.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  routes: {
    exclude: [
      'createManyBase',
      'getOneBase',
      'getManyBase',
      'replaceOneBase',
      'deleteOneBase',
      'updateOneBase',
      'recoverOneBase'
    ]
  },
  // query: {
  //   alwaysPaginate: true,
  //   limit: 10,
  // },
  dto: {
    create: CreateUserDto
  },
  serialize: {
    get: UserResponseDto,
  },
  validation: { whitelist: true, forbidNonWhitelisted: true },
})
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiUnauthorizedResponse()
@Controller('user')
export class UsersController {
  constructor(public service: UsersService) { }
  get base(): CrudController<User> {
    return this;
  }

  @Post()
  @Override('createOneBase')
  createOne(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @UseGuards(AuthGuard())
  @Get('')
  getSingleUser(@GetUser() user: User) {
    return this.service.findOne({ where: { id: user.id } });
  }
}
