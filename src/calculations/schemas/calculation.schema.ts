import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CalculationDocument = HydratedDocument<Calculation>;

@Schema({ timestamps: true })
export class Calculation {
  @Prop({ required: true })
  value: number;

  @Prop({
    type: String,
    enum: ['start', 'add', 'subtract', 'multiply', 'divide'],
    required: true,
  })
  operationType: string;

  @Prop()
  operand?: number;

  @Prop({ type: Types.ObjectId, ref: 'Calculation', default: null })
  parentId: Types.ObjectId | null;

  @Prop({ default: 0 })
  depth: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  username: string;
}

export const CalculationSchema = SchemaFactory.createForClass(Calculation);
