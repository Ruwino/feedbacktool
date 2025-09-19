import { NextFunction, Request, Response } from "express";
import { GradeService } from "../Business/Service/GradeService";

/**
 * Controller voor cijferoverzichten
 */
export class GradeController {
  private gradeService: GradeService;

  /**
   * Initialiseert een nieuwe instantie van de GradeController
   * @param gradeService Service voor cijfergegevens
   */
  constructor(gradeService: GradeService) {
    this.gradeService = gradeService;
  }

  /**
   * @author Rowin Schoon
   * Haalt cijfers op voor een specifieke student, gefilterd op vakken die de docent onderwijst
   */
  public async getStudentGradesByTeacher(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const teacherEmail = req.body.email;
      const studentEmail = req.body.studentEmail;

      if (!studentEmail) {
        res.status(400).json({ message: "Student email is required" });
        return;
      }

      const grades = await this.gradeService.getStudentGradesByTeacher(
        studentEmail,
        teacherEmail
      );
      res.status(200).json(grades);
    } catch (error) {
      console.error("Error fetching student grades:", error);
      next(error);
    }
  }

  /**
   * @author Rowin Schoon
   * Haalt cijfers op voor de ingelogde student
   */
  public async getStudentOwnGrades(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentEmail = req.body.email;
      
      if (!studentEmail) {
        res.status(400).json({ message: "Student email is required" });
        return;
      }

      const grades = await this.gradeService.getStudentOwnGrades(studentEmail);
      
      res.status(200).json(grades);
    } catch (error) {
      console.error("Error fetching student's own grades:", error);
      next(error);
    }
  }

  /**
   * @author Rowin Schoon
   * Haalt de laatste toetsgegevens op voor een lijst van studenten
   */
  public async getLatestGradesForStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const teacherEmail = req.body.email;
      const { studentEmails } = req.body;

      if (!studentEmails || !Array.isArray(studentEmails)) {
        res
          .status(400)
          .json({ message: "Lijst van student emails is vereist" });
        return;
      }

      const latestGrades = await this.gradeService.getLatestGradesForStudents(
        studentEmails,
        teacherEmail
      );

      res.status(200).json(latestGrades);
    } catch (error) {
      console.error("Error fetching latest grades:", error);
      next(error);
    }
  }
}