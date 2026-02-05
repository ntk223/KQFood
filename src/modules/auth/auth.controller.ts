import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from '@/decorator/customize';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { ResponseMessage } from '@/decorator/customize';
import { Throttle } from '@nestjs/throttler';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Throttle({default: { ttl: 60000, limit: 5 }})
  login(@Request() req) {    
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  register(@Body() user : RegisterDto ) {
    const newUser = this.authService.register(user);
    return newUser;
  }

  @Public()
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Request() req) {    
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }

  @Post('logout')
  @ResponseMessage('Logged out successfully')
  async logout(@Request() req) {    
    return this.authService.logout(req.user.sub);
  }
}


