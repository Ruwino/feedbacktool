/**
 * @author Stijn Prent
 * @description Model for a student.
 */

export class StudentModel {
    private _email: string;
    private _firstName: string;
    private _lastName: string;

    constructor(email: string, firstName: string, lastName: string) {
        this._email = email;
        this._firstName = firstName;
        this._lastName = lastName;
    }

    public toJSON = (): Record<string, unknown> => {
        return {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
        }
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