import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'isCnpjValid', async: false })
export class CnpjValidator
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    if (!value) return false;
    return cnpj.isValid(value);
  }

  defaultMessage(): string {
    return 'CNPJ inválido';
  }
}
