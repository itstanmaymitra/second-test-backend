import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthPayloadDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request, @Body() authPayload: AuthPayloadDto) {
    return this.authService.login(req['user']);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(
      registerDto.name,
      registerDto.username,
      registerDto.password,
    );
    return {
      message: 'User registered successfully',
      user,
    };
  }
}
