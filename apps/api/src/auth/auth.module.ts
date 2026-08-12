import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, LocalStrategy],
})
export class AuthModule {}
