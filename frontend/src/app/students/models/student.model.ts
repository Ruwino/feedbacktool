export class Student {
  constructor(
    public name: string,
    public email: string,
    public goal: string,
    public score: number,
    public date: string,
    public testName?: string  // Nieuwe property
  ) {}
}