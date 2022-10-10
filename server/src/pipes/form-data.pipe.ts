import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FormDataPipe implements PipeTransform {
  transform(value: any) {
    if (value?.payloadJson) {
      return JSON.parse(value.payloadJson);
    }
    return value;
  }
}
