import { Controller, Post, Body, Req, UseGuards, Get, Param, Put, Delete } from '@nestjs/common';
import { BudgetsService } from '../services/budgets.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { Request } from 'express';
import { Payload } from 'src/auth/models/payload.model';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBudgetDto } from '../dto/update-budget.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  createBudget(@Body() createBudgetDto: CreateBudgetDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.budgetsService.createBudget(createBudgetDto, userId);
  }

  @Get()
  getBudgets(@Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.budgetsService.getAllBudget(userId);
  }

  @Get(':id')
  getBudget(@Param('id') budgetId: string, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.budgetsService.getOneBudget(parseInt(budgetId), userId);
  }

  @Put(':id')
  updateBudget(@Param('id') budgetId: string, @Body() updateBudgetDto: UpdateBudgetDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.budgetsService.updateBudget(parseInt(budgetId), updateBudgetDto, userId);
  }

  @Delete(':id')
  deleteBudget(@Param('id') budgetId: string, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.budgetsService.deleteBudget(parseInt(budgetId), userId);
  }
}
