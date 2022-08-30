
import { Injectable, Inject } from '@nestjs/common';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodService extends TypeOrmCrudService<Food> {
  constructor(
    @Inject('FOOD_REPOSITORY')
    private foodRepository: Repository<Food>,
  ) {
    super(foodRepository);
  }

  async create(dto: CreateFoodDto,userId:number): Promise<Food> {
    const userToInsert = { ...dto, takenDateTime: new Date(),userId:userId }
    const insertedUser = this.foodRepository.create(userToInsert);
    return this.foodRepository.save(insertedUser);
  }

  async update(id:number,dto: UpdateFoodDto): Promise<Food> {
    const foodToUpdate = await this.foodRepository.findOne({ where: { id } });
    foodToUpdate.calorieValue = dto.calorieValue;
    foodToUpdate.name = dto.name;
    return this.foodRepository.save(foodToUpdate);
  }

  async updatePrice(id: number, price: number): Promise<Food> {
    const foodToUpdatePrice = await this.foodRepository.findOne({ where: { id } });
    foodToUpdatePrice.price = price;
    return this.foodRepository.save(foodToUpdatePrice);
  }
}
