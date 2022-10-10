import FormData from "form-data";

export class CustomFormData extends FormData {
  private payloadJson = {} as any;

  dataAppend(name: string, value: any): void {
    this.payloadJson[name] = value;
  }

  data() {
    this.append("payloadJson", JSON.stringify(this.payloadJson));
    return this;
  }
}
