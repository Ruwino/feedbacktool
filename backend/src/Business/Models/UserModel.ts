import { UserType } from "../../Enums/UserType";

export class UserModel {
  /**
   * Initialiseert een nieuwe instantie van de UserModel
   * @param email Email van de gebruiker
   * @param firstName Voornaam van de gebruiker
   * @param lastName Achternaam van de gebruiker
   * @param userType Het type gebruiker (Student, Teacher, etc.)
   */
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly userType: UserType,
  ) {}

  /**
   * Controleert of de gebruiker een student is
   * @returns True als de gebruiker een student is, anders false
   */
  public isStudent(): boolean {
    return this.userType === UserType.Student;
  }

  /**
   * Controleert of de gebruiker een docent is
   * @returns True als de gebruiker een docent is, anders false
   */
  public isTeacher(): boolean {
    return this.userType === UserType.Teacher;
  }

  /**
   * Geeft de volledige naam van de gebruiker
   * @returns Volledige naam (voornaam + achternaam)
   */
  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}