import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CreateOperation, CreateStartNumber } from './dto/calculation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  // /calculations/start - create starting number
  @Post('start')
  @UseGuards(JwtAuthGuard)
  async createStartNumber(@Body() startNum: CreateStartNumber, @Req() req) {
    return this.calculationsService.createStartNumber(
      startNum,
      req.user.userId,
      req.user.username,
    );
  }

  // GET /calculations - get all calculations as tree
  @Get()
  async getAllCalculations() {
    return this.calculationsService.getAllCalculations();
  }

  // POST /calculations/operation - create an operation
  @Post('operation')
  @UseGuards(JwtAuthGuard)
  async createOperation(@Body() operation: CreateOperation, @Req() req) {
    return this.calculationsService.createOperation(
      operation,
      req.user.userId,
      req.user.username,
    );
  }
}
