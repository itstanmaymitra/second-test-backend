export class CreateStartNumber {
  value: number;
}

export class CreateOperation {
  parentId: string;
  operationType: 'add' | 'subtract' | 'multiply' | 'divide';
  operand: number;
}
