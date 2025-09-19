/**
 * @author Roan Slingerland
 */
export class SessionModel {
    private _sessionId!: string;
    private _expirationDate!: Date;
    private _email!: string;

    constructor(sessionId: string, expirationDate: Date, email: string) {
        this.sessionId = sessionId;
        this.expirationDate = expirationDate;
        this.email = email;
    }

    public get sessionId(): string {
        return this._sessionId;
    }

    public set sessionId(value: string) {
        if(!value || value.trim().length === 0) {
            throw new Error("SessionID is empty.");
        }

        this._sessionId = value;
    }

    public get expirationDate(): Date {
        return this._expirationDate;
    }

    public set expirationDate(value: Date) {
        if(!value) {
            throw new Error("Session has expired.");
        }

        this._expirationDate = value;
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
}