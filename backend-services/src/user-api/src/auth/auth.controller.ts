import { Controller, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { RequestLoggingInterceptor } from '../logging/request-logging.interceptor';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(RequestLoggingInterceptor)
export class AuthController {
  constructor(
    private readonly logger: StimulusLogger,
    private authService: AuthService
  ) {
    this.logger.context = AuthController.name;
  }
  @UseGuards(AuthGuard('external-basic'))
  @Post('/external/register')
  async registerExternal(@Req() req: Request, @Res() res: Response) {
    res.status(HttpStatus.ACCEPTED).send();
    this.logger.log(JSON.stringify(req.body));
    // create user here using the "objectId" as externalAuthSystemId
    const { objectId: externalAuthSystemId, email } = req.body;

    await this.authService.createUser(externalAuthSystemId, email);
  }
}
