import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest
} from '@nestjsx/crud';
import { Role } from 'src/auth/enums/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/entities/user.entity';

import { CreateFoodDto } from './dto/create-food.dto';
import { FoodManyResponseDTO, FoodResponseDto } from './dto/food-response.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './entities/food.entity';
import { FoodService } from './food.service';

@Crud({
  model: {
    type: Food,
  },
  routes: {
    exclude: [
      'createManyBase',
      'replaceOneBase',
    ],
  },
  // query: {
  //   alwaysPaginate: true,
  //   limit: 10
  // },
  dto: {
    create: CreateFoodDto,
    update: UpdateFoodDto
  },
  serialize: {
    getMany: FoodManyResponseDTO,
    get: FoodResponseDto,
    create: CreateFoodDto
  },
  validation: { whitelist: true, forbidNonWhitelisted: true }
})

@CrudAuth({
  property: 'user',
  filter: (user: User) => (
    user.role == 'admin' ? {} : {
      userId: user.id,
    }),
  persist: (user) => (user.role == 'admin' ? {} : { userId: user.id }),
})
@ApiTags('food')
@Controller('food')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@UseGuards(RolesGuard)
@ApiUnauthorizedResponse()
@UseInterceptors(ClassSerializerInterceptor)
export class FoodController {
  constructor(public service: FoodService) { }
  get base(): CrudController<Food> {
    return this;
  }

  @Post()
  @Override('createOneBase')
  @Roles(Role.Admin, Role.User)
  createOne(@GetUser() user: User, @Body(ValidationPipe) createFoodDto: CreateFoodDto) {
    return this.service.create(createFoodDto, user.id);
  }

  @Override()
  @Roles(Role.Admin, Role.User)
  async getMany(@ParsedRequest() req: CrudRequest) {
    return await this.service.getMany(req)
  }

  @Roles(Role.Admin, Role.User)
  @Patch('/:id/update-price/:price')
  updatePrice(@Param('id') id: number, @Param('price') price: number) {
    return this.service.updatePrice(id, price);
  }

  @Override()
  @Roles(Role.Admin)
  updateOne(@Param('id') id: number, @Body() dto: UpdateFoodDto) {
    return this.service.update(id, dto);
  }

  @Override()
  @Roles(Role.Admin)
  deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.service.deleteOne(req);
  }
}
