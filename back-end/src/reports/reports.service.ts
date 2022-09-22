import { Injectable } from '@nestjs/common';
import groupBy  from 'lodash/groupBy';
import moment from 'moment';
import { Food } from 'src/food/entities/food.entity';
import { FoodService } from 'src/food/food.service';
import { Between } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    private foodService: FoodService,
  ) { }

  async getFoodCountEntries() {
    const currentDate = moment().toDate();
    const sevenDaysFromNow = moment().subtract(7,'d').startOf('day').toDate();
    const previousOneWeek = moment(sevenDaysFromNow).subtract(7, 'd').toDate();
    const getLast7DaysFood = await this.foodService.find({
      where: { takenDateTime: Between(sevenDaysFromNow, currentDate) }
    });
    const getPrevious7DaysFood = await this.foodService.find({
      where: { takenDateTime: Between(previousOneWeek, sevenDaysFromNow) }
    });
    const last7DaysCalories = this.calculateCaloriesByUser(getLast7DaysFood);

    return {
      lastWeekCount: getLast7DaysFood.length,
      previousWeekCount: getPrevious7DaysFood.length,
      last7DaysCalories
    }
  }

  calculateCaloriesByUser(foodsList: Food[]) {
    const groupByDate = groupBy(foodsList, (a) => `${a.user.firstName} ${a.user.lastName}`);
    const res = Object.entries(groupByDate);
    const caloriesGrouped = res.map((gre) => {
      const currentAverage = gre[1].reduce((a, b) => a + Number(b.calorieValue), 0) / gre[1].length;
      return { userName: gre[0], average: currentAverage }
    });
    return caloriesGrouped;
  }
}
