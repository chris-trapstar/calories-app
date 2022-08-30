
import { DataSource } from 'typeorm';
import { Food } from './entities/food.entity';

export const FoodProvider = [
  {
    provide: 'FOOD_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Food),
    inject: ['DATA_SOURCE'],
  },
];
