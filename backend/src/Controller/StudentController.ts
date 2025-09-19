import express from "express";
import { StudentService } from "../Business/Service/StudentService";
import { StudentModel } from "../Business/Models/StudentModel";
import { ClassModel } from "../Business/Models/ClassModel";

export class StudentController {
  private studentService: StudentService;

  constructor(studentService: StudentService) {
    this.studentService = studentService;
  }

  /**
   * @author Stijn Prent
   * @description Get all students.
   * @param req
   * @param res
   */
  public async getStudents(req: express.Request, res: express.Response) {
    try {
      const students: StudentModel[] = await this.studentService.getStudents();
      res.status(200).json(students.map((student) => student.toJSON()));
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  /**
   * @author Rowin Schoon
   * @description Get all students per class.
   * @param req
   * @param res
   */

  public async getStudentsByClass(req: express.Request, res: express.Response) {
    try {
      const classId = req.body.classId; // Haal classId uit de body
      const students: StudentModel[] =
        await this.studentService.getStudentsByClass(classId);
      res.status(200).json(students.map((student) => student.toJSON()));
    } catch (error) {
      res.status(500).json({ message: "Database error" });
    }
  }
}
