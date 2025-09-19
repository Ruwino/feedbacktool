import { SubjectType } from "../../Enums/SubjectType";

export class RegisterModel {
  private _firstName!: string;
  private _lastName!: string;
  private _email!: string;
  private _password!: string;
  private _subjects: string[] = [];

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    subjects: string[]
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;

    this.subjects = subjects;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("First name cannot be empty");
    }
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Last name cannot be empty");
    }
    this._lastName = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Email cannot be empty");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Invalid email format");
    }

    this._email = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Password cannot be empty");
    }

    if (value.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    this._password = value;
  }

  public get subjects(): string[] {
    return this._subjects;
  }

  public set subjects(values: string[]) {
    if (!values || values.length === 0) {
      throw new Error("At least one subject must be selected");
    }

    const allowedSubjects = Object.values(SubjectType);
    for (const value of values) {
      if (!value || value.trim().length === 0) {
        throw new Error("Subject cannot be empty");
      }

      if (!allowedSubjects.includes(value as SubjectType)) {
        throw new Error(`Invalid subject selection: ${value}`);
      }
    }

    this._subjects = values;
  }
}
