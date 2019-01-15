import { FieldBase } from './field-base';

export class AutocompField extends FieldBase<string> {
  controlType = 'autocomplete';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
