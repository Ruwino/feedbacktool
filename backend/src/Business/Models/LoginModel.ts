/**
 * @author Roan Slingerland
 */
export class LoginModel {
    private _email!: string;
    private _password!: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public get email(): string {
        return this._email;
    }

    public set email(value: string) {
        if(!value || value.trim().length === 0) {
            throw new Error("Email is empty.");
        }

        this._email = value;
    }

    public get password(): string {
        return this._password;
    }

    public set password(value: string) {
        if(!value || value.trim().length === 0) {
            throw new Error("Password is empty.");
        }

        this._password = value;
    } 
}