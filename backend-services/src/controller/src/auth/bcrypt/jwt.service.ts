import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ExternalSystemAuth } from '../entities/externalSystemAuth.entity';
import { TokenDto } from './token.dto';

@Injectable()
export class JWTService {
  async generateNewHash(authCredentials: ExternalSystemAuth): Promise<TokenDto> {
    const { sign } = jwt;
    const hash = await sign({ authCredentials }, 'secret', {
      expiresIn: '1h',
    });
    return { token: hash };
  }

  async validateToken(token: string): Promise<ExternalSystemAuth> {
    const { verify } = jwt;
    try {
      const externalSystemCredentials: any = await verify(token, 'secret');
      return { ...externalSystemCredentials };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
