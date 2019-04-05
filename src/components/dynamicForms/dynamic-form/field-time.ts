import { FieldBase } from './field-base';

export class TimeField extends FieldBase<string> {
  controlType = 'time';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
