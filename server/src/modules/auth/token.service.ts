import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Token, TokenType } from './entities/token.entity';
import crypto from 'crypto';
import moment, { Moment } from 'moment';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/interfaces/env.interface';
import { JWTPayload } from 'src/interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: EntityRepository<Token>,
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  createToken = async (userId: string, type: TokenType) => {
    const token = crypto.randomBytes(24).toString('hex');
    let expiresIn = new Date();

    switch (type) {
      case TokenType.REFRESH_TOKEN: {
        expiresIn = moment()
          .add(this.configService.get('REFRESH_TOKEN_EXPIRATION_DAYS'), 'days')
          .toDate();
        break;
      }
      case TokenType.VERIFY_EMAIL: {
        expiresIn = moment()
          .add(
            this.configService.get('VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES'),
            'minutes',
          )
          .toDate();
        break;
      }
      case TokenType.RESET_PASSWORD: {
        expiresIn = moment()
          .add(
            this.configService.get('RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES'),
            'minutes',
          )
          .toDate();
        break;
      }
    }

    await this.tokenRepository.persistAndFlush(
      this.tokenRepository.create({
        _id: token,
        expiresIn,
        type: TokenType.REFRESH_TOKEN,
        user: userId,
      }),
    );

    return token;
  };

  createJwtToken = (userId: string, expires: Moment) => {
    const payload: JWTPayload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
    };
    return this.jwtService.sign(payload);
  };

  verifyJwtToken = (token: string) => {
    return this.jwtService.verify<JWTPayload>(token);
  };

  refresh = async (refreshToken: string) => {
    const token = await this.tokenRepository.findOneOrFail(refreshToken);
    const newTokens = this.createAuthTokens(token.user.id);

    await this.tokenRepository.removeAndFlush(token);

    return newTokens;
  };

  createAuthTokens = async (userId: string) => {
    const accessTokenExpires = moment().add(
      this.configService.get<number>('ACCESS_TOKEN_EXPIRATION_MINUTES'),
      'minutes',
    );
    const accessToken = this.createJwtToken(userId, accessTokenExpires);
    const refreshToken = await this.createRefreshToken(userId);
    return {
      accessToken,
      refreshToken,
    };
  };

  createRefreshToken = async (userId: string) => {
    return this.createToken(userId, TokenType.REFRESH_TOKEN);
  };

  createResetPasswordToken = async (userId: string) => {
    return this.createToken(userId, TokenType.RESET_PASSWORD);
  };

  createVerifyEmailToken = async (userId: string) => {
    return this.createToken(userId, TokenType.VERIFY_EMAIL);
  };
}
