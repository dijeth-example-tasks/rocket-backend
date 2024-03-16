export class GetUsersBodyDto {
  readonly ids: number[];
  constructor(ids: number[]) {
    this.ids = ids;
  }
}
