import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import config from 'config';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from 'src/users/users.service';
import { UserProvider } from 'src/users/user.provider';
import { AdminController } from './admin.controller';

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
  controllers: [AdminController],
  providers: [
    ...UserProvider,
    UsersService
  ],
})
export class AdminModule {}
