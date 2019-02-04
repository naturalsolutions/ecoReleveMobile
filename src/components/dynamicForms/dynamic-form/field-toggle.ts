import { FieldBase } from './field-base';

export class ToggleField extends FieldBase<string> {
  controlType = 'toggle';
  //options: {key: string, value: string}[] = [];
  type: string;
  constructor(options: {} = {}) {
    super(options);
    //this.options = options['options'] || [];
    this.type = options['type'] || '';
  }
}
