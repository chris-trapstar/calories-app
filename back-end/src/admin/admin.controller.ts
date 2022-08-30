import {
    Controller,
    Get,
    Param,
    UseGuards,
} from '@nestjs/common';
import {
    Crud,
    CrudRequest,
    Override,
    ParsedRequest,
} from '@nestjsx/crud';
import {
    ApiBearerAuth,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/entities/user.entity';
import { UserManyResponseDto, UserResponseDto } from 'src/users/dto/user-response.dto';
import { UsersService } from 'src/users/users.service';

@Crud({
  model: {
    type: User,
  },
  routes: {
    exclude: [
      'createManyBase',
      'createOneBase',
      'replaceOneBase',
      'deleteOneBase',
      'updateOneBase',
      'recoverOneBase'
    ]
  },
  serialize: {
    get: UserResponseDto,
    getMany: UserManyResponseDto
  },
  validation: { whitelist: true, forbidNonWhitelisted: true },
})
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiUnauthorizedResponse()
@Controller('admin')
export class AdminController {
  constructor(public service: UsersService) { }

  @Override()
  @Roles(Role.Admin)
  @Get('users/:id')
  getOne(@Param('id') id: number) {
    return this.service.findOne({ where: { id } });
  }

  @Override()
  @Get('users')
  @UseGuards(AuthGuard())
  @Roles(Role.Admin)
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.service.getMany(req);
  }
}
