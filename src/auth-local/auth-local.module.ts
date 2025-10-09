import { Module } from '@nestjs/common';
import { AuthLocalController } from './auth-local.controller';
import { AuthLocalService } from './auth-local.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MailModule } from '../mail/mail.module';
import { SessionModule } from '../session/session.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthLocalController],
  providers: [
    AuthLocalService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
  ],
  exports: [AuthLocalService],
})
export class AuthLocalModule {}
