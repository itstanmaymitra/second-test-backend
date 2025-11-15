import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CalculationDocument } from './schemas/calculation.schema';
import { Model, Types } from 'mongoose';
import { CreateOperation, CreateStartNumber } from './dto/calculation.dto';

@Injectable()
export class CalculationsService {
  constructor(
    @InjectModel('Calculation')
    private calculationModel: Model<CalculationDocument>,
  ) {}

  // Build tree structure
  private buildTree(calculations: CalculationDocument[]) {
    const map = new Map<string, any>();
    const roots: any[] = [];

    calculations.forEach((calc) => {
      map.set(calc._id.toString(), { ...calc.toObject(), children: [] });
    });

    calculations.forEach((calc) => {
      const node = map.get(calc._id.toString());
      if (calc.parentId) {
        const parent = map.get(calc.parentId.toString());
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  // do math
  private performOperation(
    leftValue: number,
    operation: string,
    rightValue: number,
  ): number {
    switch (operation) {
      case 'add':
        return leftValue + rightValue;
      case 'subtract':
        return leftValue - rightValue;
      case 'multiply':
        return leftValue * rightValue;
      case 'divide':
        if (rightValue === 0) {
          throw new BadRequestException('Cannot divide by zero');
        }
        return leftValue / rightValue;
      default:
        throw new BadRequestException('Invalid operation type');
    }
  }

  // create a starting number
  async createStartNumber(
    startingNum: CreateStartNumber,
    userId: string,
    username: string,
  ) {
    const calculation = new this.calculationModel({
      value: startingNum.value,
      operationType: 'start',
      parentId: null,
      depth: 0,
      userId: new Types.ObjectId(userId),
      username: username,
    });
    return calculation.save();
  }

  // Get all calculations
  async getAllCalculations() {
    const calculations = await this.calculationModel.find().exec();
    return this.buildTree(calculations);
  }

  // create an operation to an existing calculation
  async createOperation(
    operation: CreateOperation,
    userId: string,
    username: string,
  ) {
    const parent = await this.calculationModel
      .findById(operation.parentId)
      .exec();
    if (!parent) {
      throw new NotFoundException('Parent calculation not found');
    }

    const newValue = this.performOperation(
      parent.value,
      operation.operationType,
      operation.operand,
    );

    const calculation = new this.calculationModel({
      value: newValue,
      operationType: operation.operationType,
      operand: operation.operand,
      parentId: new Types.ObjectId(operation.parentId),
      depth: parent.depth + 1,
      userId: new Types.ObjectId(userId),
      username: username,
    });

    return calculation.save();
  }
}
