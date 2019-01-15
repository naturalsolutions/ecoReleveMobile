import { FieldBase } from './field-base';

export class NumberField extends FieldBase<string> {
  controlType = 'number';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
