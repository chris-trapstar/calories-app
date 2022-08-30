import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import config from 'config';
import { DatabaseModule } from 'src/database/database.module';
import { UserProvider } from './user.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const jwtConfig: any = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expireIn,
      },
    }),
    DatabaseModule
  ],
  controllers: [UsersController],
  providers: [
    ...UserProvider,
    UsersService
  ],
})
export class UsersModule {}
