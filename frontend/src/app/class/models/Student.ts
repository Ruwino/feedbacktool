export class Student {
  private _email: string;
  private _firstName: string;
  private _lastName: string;

  constructor(email: string, firstName: string, lastName: string) {
    this._email = email;
    this._firstName = firstName;
    this._lastName = lastName;
  }

  public get email(): string {
    return this._email;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }
}
