export class Grade {
  constructor(
    public subject: string,
    public score: string,
    public percentage: number,
    public learningObjectives: string[] = [],
    public id?: string, // Nodig voor expandable rows met dataKey
  ) {
    // Als er geen id is, genereer dan een unieke id
    if (!this.id) {
      this.id = Math.random().toString(36).substring(2);
    }
  }
}