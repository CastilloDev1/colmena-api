import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments) {
    if (!value) return false;
    const date = new Date(value);
    return date > new Date();
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} debe ser una fecha futura.`;
  }
}
