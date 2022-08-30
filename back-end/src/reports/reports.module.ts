import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import config from 'config';
import { DatabaseModule } from 'src/database/database.module';
import { FoodProvider } from 'src/food/food.provider';
import { FoodService } from 'src/food/food.service';

import { ReportController } from './reports.controller';
import { ReportsService } from './reports.service';

const jwtConfig: any = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expireIn },
    }),
    DatabaseModule
  ],
  controllers: [ReportController],
  providers: [
    ...FoodProvider,
    ReportsService,
    FoodService
  ],
})
export class ReportsModule {}
