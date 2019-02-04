import { FieldBase } from './field-base';

export class Taxonlist extends FieldBase<string> {
  controlType = 'taxonlist';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
