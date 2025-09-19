import { ISubjectRepository } from "../Interfaces/ISubjectRepository";
import SubjectTable from "../Tables/SubjectTable";
import { SubjectModel } from "../../Business/Models/SubjectModel";
import { SubjectTestModel } from "../../Business/Models/SubjectTestModel";
import { TestModel } from "../../Business/Models/TestModel";
import TestTable from "../Tables/TestTable";
import ClassTable from "../Tables/ClassTable";
import { DatabaseError } from "../../Errors/DatabaseError";
import SubjectHasTeacherTable from "../Tables/SubjectHasTeacherTable";
import { ClassModel } from "../../Business/Models/ClassModel";

export class SubjectRepository implements ISubjectRepository {

    /**
     * @author Luka Piersma
     */
    public async getSubjectsByTeacherEmail(teacherEmail: string): Promise<SubjectModel[]> {
        try {
            const teacherSubjects = await SubjectHasTeacherTable.findAll({
                where: {
                    user_email: teacherEmail
                },
                include: [SubjectTable]
            });

            return teacherSubjects.map(teacherSubject => new SubjectModel(
                teacherSubject.subject.id,
                teacherSubject.subject.name
            ));
        } catch (error) {
            throw new Error('Something went wrong when trying to get subjects by teacher email.');
        }
    }

    /**
     * @author Luka Piersma
     */
    public async getSubjectByName(name: string): Promise<SubjectModel | null> {
        try {
            const subject = await SubjectTable.findOne({
                where: {
                    name: name
                }
            });

            if (!subject) return null;

            return new SubjectModel(subject?.id, subject?.name);
        } catch {
            throw new DatabaseError('Error while fetching subject by id.');
        }
    }

    /**
     * @author Stijn Prent
     * @description Fetch subjects
     * @returns Promise<SubjectModel[]>
     */
    public async getAllSubjects(): Promise<SubjectModel[]> {
        try {
            const subjects = await SubjectTable.findAll({
                attributes: ["id", "name"],
                raw: true,
            });

            return subjects.map(subject => new SubjectModel(
                subject.id,
                subject.name
            ));
        } catch (error) {
            console.error("Error fetching subjects:", error);
            throw new Error("Database query failed.");
        }
    }

    /**
     * @author Latricha Seym
     * @description Gets all the subjects with the belonging tests from the database.
     * @returns SubjectTestModel
     * 
     */
    public async getSubjectsWithTests(classes: ClassModel[]): Promise<SubjectTestModel[]> {
        const classIds = classes.map(cls => cls.id);
        try {
            const subjects: SubjectTable[] = await SubjectTable.findAll({
                include: [
                    {
                        model: ClassTable,
                        where: { id: classIds },
                        include: [
                            {
                                model: TestTable,
                                through: {
                                    attributes: ['visible'],
                                    where: { visible: true }

                                },
                            }
                        ],

                    }
                ]
            })


            return this.mapToSubjectTestModel(subjects);

        } catch (error: any) {
            throw new DatabaseError(`Database error: ${error.message || error}`);

        }


    }


    /**
     * @author Latricha Seym
     * @param subjects 
     * @returns SubjectTestModel
     */
    private mapToSubjectTestModel(subjects: SubjectTable[]): SubjectTestModel[] {

        return subjects.map(subject => {
            const testMap = new Map<number, TestModel>();

            subject.classes.forEach(cls => {
                cls.tests.forEach(test => {

                    if (!testMap.has(test.id)) {
                        testMap.set(
                            test.id,
                            new TestModel(test.id, test.name, test.duration, true, [])
                        );
                    }
                });
            });

            return new SubjectTestModel(
                subject.id,
                subject.name,
                Array.from(testMap.values()))
        })

    }
}



