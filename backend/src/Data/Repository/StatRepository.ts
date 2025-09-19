import {IStatRepository} from "../Interfaces/IStatRepository";
import {sequelize} from "../../Database/Configuration";
import {DatabaseError} from "../../Errors/DatabaseError";
import {col, fn, literal, Op, QueryTypes} from "sequelize";
import {StreakModel} from "../../Business/Models/StreakModel";
import TestTable from "../Tables/TestTable";
import QuestionTable from "../Tables/QuestionTable";
import UserAnsweredQuestionTable from "../Tables/UserAnsweredQuestionTable";
import {MadeTestsModel} from "../../Business/Models/MadeTestsModel";
import ClassTable from "../Tables/ClassTable";
import AnswerTable from "../Tables/AnswerTable";
import LearningObjectiveTable from "../Tables/LearningObjectiveTable";
import {TestModel} from "../../Business/Models/TestModel";
import ClassHasTestTable from "../Tables/ClassHasTestTable";
import TestHasQuestionTable from "../Tables/TestHasQuestionTable";
import ClassHasUser from "../Tables/ClassHasUser";

export class StatRepository implements IStatRepository {
    /**
     * Retrieves the best learning objective for a given user based on their answered questions.
     *
     * @param {string} userEmail - The email of the user.
     * @returns {Promise<string>} - A promise that resolves to the description of the best learning objective.
     * @throws {DatabaseError} - If there is an error during the database query.
     *
     * @author Stijn Prent
     */
    public async getBestObjective(userEmail: string): Promise<string> {
        try {
            const responses = await UserAnsweredQuestionTable.findAll({
                where: { user_email: userEmail },
                include: [{
                    model: QuestionTable,
                    include: [
                        {
                            model: AnswerTable,
                            through: { attributes: [] },
                            attributes: ['id', 'correct', 'answer']
                        },
                        {
                            model: LearningObjectiveTable,
                            through: { attributes: [] },
                            attributes: ['id', 'description']
                        }
                    ]
                }]
            });

            const objectiveCounts: { [id: number]: { count: number; description: string } } = {};

            for (const response of responses) {
                const question = response.question;
                if (!question || !question.answers || !question.objectives) continue;
                const correctAnswer = question.answers.find((a: any) => a.correct === true || a.correct === 1);
                if (!correctAnswer) continue;
                if (Number(response.answer) !== correctAnswer.id) continue;
                for (const objective of question.objectives) {
                    const id = objective.id;
                    if (!objectiveCounts[id]) {
                        objectiveCounts[id] = { count: 0, description: objective.description };
                    }
                    objectiveCounts[id].count += 1;
                }
            }

            let bestObjectiveId: number | null = null;
            let maxCount = -1;
            for (const idStr in objectiveCounts) {
                const { count } = objectiveCounts[idStr];
                if (count > maxCount) {
                    maxCount = count;
                    bestObjectiveId = Number(idStr);
                }
            }

            return bestObjectiveId === null
                ? "Geen beste leerdoel gevonden"
                : objectiveCounts[bestObjectiveId].description;
        } catch (error) {
            console.error("Error fetching best objective:", error);
            throw new DatabaseError("Database query failed.");
        }
    }

    /**
     * Calculates the average score for a given class based on the tests taken.
     *
     * @param {number} classId - The ID of the class.
     * @returns {Promise<number>} - A promise that resolves to the average score of the class.
     * @throws {DatabaseError} - If there is an error during the database query.
     *
     * @author Stijn Prent
     */
    public async getClassAverage(classId: number): Promise<number> {
        try {
            // First, get all students in this class
            const classStudents = await ClassHasUser.findAll({
                where: { class_id: classId },
                attributes: ['user_email']
            });

            // Create a set of student emails for efficient lookups
            const classStudentEmails = new Set(classStudents.map(student => student.user_email));

            const tests = await TestTable.findAll({
                attributes: ['id'],
                include: [
                    { model: ClassTable, where: { id: classId }, attributes: [] },
                    {
                        model: QuestionTable,
                        include: [
                            {
                                model: AnswerTable,
                                through: { attributes: [] },
                                attributes: ['id', 'correct', 'answer']
                            },
                            {
                                model: UserAnsweredQuestionTable,
                                attributes: ['user_email', 'question_id', 'answer', 'timestamp']
                            }
                        ]
                    }
                ]
            });

            const testAverages: number[] = [];

            tests.forEach(test => {
                if (!test.questions || test.questions.length === 0) return;
                const studentGrades: { [email: string]: { totalErrors: number; totalQuestions: number } } = {};

                test.questions.forEach(question => {
                    // First check if this question has a correct answer
                    if (!question.answers || question.answers.length === 0) {
                        return; // Skip questions with no answers
                    }

                    const correctAnswer = question.answers.find((a: any) => a.correct === true);

                    // Skip questions with no correct answer
                    if (!correctAnswer) {
                        return;
                    }

                    // Get student responses sorted by timestamp
                    const responses = [...(question.user_answered_questions || [])].sort((a: any, b: any) =>
                        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    );

                    // Process each student in class
                    for (const email of classStudentEmails) {
                        // Get all attempts by this student for this question
                        const studentResponses = responses.filter((r: any) => r.user_email === email);

                        // Skip if student didn't attempt this question
                        if (studentResponses.length === 0) continue;

                        if (!studentGrades[email]) {
                            studentGrades[email] = { totalErrors: 0, totalQuestions: 0 };
                        }

                        // Find if student got correct answer in any attempt
                        let gotCorrectAnswer = false;
                        let attemptsBeforeCorrect = 0;

                        for (let i = 0; i < studentResponses.length; i++) {
                            const studentAnswer = studentResponses[i].answer;

                            // Compare student's answer with the correct answer content
                            if (studentAnswer == correctAnswer.answer) {
                                gotCorrectAnswer = true;
                                attemptsBeforeCorrect = i;
                                break;
                            }
                        }

                        // Update student grades
                        if (!gotCorrectAnswer) {
                            // Student never got the correct answer - count as 1 error
                            studentGrades[email].totalErrors += 1;
                        } else {
                            // Student eventually got it right - add penalty for extra attempts
                            studentGrades[email].totalErrors += attemptsBeforeCorrect;
                        }

                        studentGrades[email].totalQuestions += 1;
                    }
                });

                const percentages: number[] = [];
                for (const [email, { totalErrors, totalQuestions }] of Object.entries(studentGrades)) {
                    if (totalQuestions > 0) {
                        const scorePercentage = Math.max(
                            0,
                            (1 - totalErrors / totalQuestions) * 100
                        );
                        percentages.push(scorePercentage);
                    }
                }

                if (percentages.length > 0) {
                    const testAverage = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
                    testAverages.push(testAverage);
                }
            });

            if (testAverages.length === 0) return 0;
            const classAverage = testAverages.reduce((sum, avg) => sum + avg, 0) / testAverages.length;
            return classAverage;
        } catch (error) {
            console.error("Error fetching class average:", error);
            throw new DatabaseError("Database query failed: " + error);
        }
    }

    /**
     * Retrieves the total number of tests made by a class in the current week.
     *
     * @param {number} classId - The ID of the class.
     * @returns {Promise<number>} - A promise that resolves to the total number of tests made by the class in the current week.
     * @throws {Error} - If there is an error during the database query.
     *
     * @author Stijn Prent
     */
    public async getClassTotalTests(classId: number): Promise<number> {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        try {
            const tests = await TestTable.findAll({
                attributes: ['id'],
                include: [
                    { model: ClassTable, where: { id: classId }, attributes: [] },
                    {
                        model: QuestionTable,
                        required: true,
                        include: [{
                            model: UserAnsweredQuestionTable,
                            required: true,
                            attributes: ['user_email'],
                            where: { timestamp: { [Op.gte]: startOfWeek } }
                        }]
                    }
                ]
            });

            const uniqueEmails = new Set<string>();
            tests.forEach(test => {
                test.questions?.forEach(question => {
                    question.user_answered_questions?.forEach(response => {
                        uniqueEmails.add(response.user_email);
                    });
                });
            });
            return uniqueEmails.size;
        } catch (error) {
            console.error("Error fetching current week test count for class:", error);
            throw new Error("Database query failed.");
        }
    }

    /**
     * Retrieves the worst learning objective for a given class based on their answered questions.
     *
     * @param {number} classId - The ID of the class.
     * @returns {Promise<string>} - A promise that resolves to the description of the worst learning objective.
     * @throws {DatabaseError} - If there is an error during the database query.
     *
     * @author Stijn Prent
     */
    public async getClassWorstObjective(classId: number): Promise<string> {
        try {
            const theClass = await ClassTable.findByPk(classId, {
                include: [
                    {
                        model: TestTable,
                        as: 'tests',
                        attributes: ['id', 'name', 'duration'],
                        include: [
                            {
                                model: QuestionTable,
                                as: 'questions',
                                include: [
                                    {
                                        model: AnswerTable,
                                        as: 'answers',
                                        through: { attributes: [] },
                                        attributes: ['id', 'correct', 'answer']
                                    },
                                    {
                                        model: UserAnsweredQuestionTable,
                                        as: 'user_answered_questions',
                                        attributes: ['user_email', 'question_id', 'answer']
                                    },
                                    {
                                        model: LearningObjectiveTable,
                                        as: 'objectives',
                                        attributes: ['id', 'description']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            if (!theClass || !theClass.tests) {
                return "Geen slechtste leerdoel gevonden";
            }

            const objectiveCounts: Record<number, number> = {};
            const objectiveDesc: Record<number, string> = {};

            for (const test of theClass.tests) {
                if (!test.questions) continue;

                for (const question of test.questions) {
                    const correctAnswer = question.answers?.find(a => a.correct === true);
                    let correctCountForThisQuestion = 0;

                    if (correctAnswer && question.user_answered_questions) {
                        for (const response of question.user_answered_questions) {
                            if (response.answer.trim() === correctAnswer.answer.trim()) {
                                correctCountForThisQuestion++;
                            }
                        }
                    }

                    if (question.objectives) {
                        for (const obj of question.objectives) {
                            if (!objectiveCounts[obj.id]) {
                                objectiveCounts[obj.id] = 0;
                                objectiveDesc[obj.id] = obj.description;
                            }
                            objectiveCounts[obj.id] += correctCountForThisQuestion;
                        }
                    }
                }
            }

            let worstObjectiveId: number | null = null;
            let minCount = Infinity;

            for (const [idStr, count] of Object.entries(objectiveCounts)) {
                const idNum = Number(idStr);
                if (count < minCount) {
                    minCount = count;
                    worstObjectiveId = idNum;
                }
            }

            if (worstObjectiveId === null) {
                return "Geen slechtste leerdoel gevonden";
            }

            return objectiveDesc[worstObjectiveId] || "Geen slechtste leerdoel gevonden";
        } catch (error) {
            console.error("Error fetching worst objective:", error);
            throw new DatabaseError("Database query failed.");
        }
    }

    /**
     * Retrieves the number of tests made by a user.
     *
     * @param {string} userEmail - The email of the user.
     * @returns {Promise<MadeTestsModel>} - A promise that resolves to a MadeTestsModel containing the total number of tests and the number of tests made in the current week.
     * @throws {Error} - If there is an error during the database query.
     *
     * @author Stijn Prent
     */
    public async getMadeTests(userEmail: string): Promise<MadeTestsModel> {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startOfWeek = new Date(now.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0);

        try {
            const allTests = await TestTable.findAll({
                attributes: ["id", "name", "duration"],
                include: [{
                    model: QuestionTable,
                    required: true,
                    include: [{
                        model: UserAnsweredQuestionTable,
                        as: "user_answered_questions",
                        required: true,
                        attributes: ["user_email", "question_id", "answer", "timestamp"],
                        where: {user_email: userEmail}
                    }]
                }]
            });

            const currentWeekTests = await TestTable.findAll({
                attributes: ["id", "name", "duration"],
                include: [{
                    model: QuestionTable,
                    required: true,
                    include: [{
                        model: UserAnsweredQuestionTable,
                        as: "user_answered_questions",
                        required: true,
                        attributes: ["user_email", "question_id", "answer", "timestamp"],
                        where: {
                            user_email: userEmail,
                            timestamp: {[Op.gte]: startOfWeek}
                        }
                    }]
                }]
            });

            return new MadeTestsModel(allTests.length, currentWeekTests.length);
        } catch (error) {
            console.error("Error fetching made tests:", error);
            throw new Error("Database query failed.");
        }
    }

    /**
     * Retrieves the current and longest streak of consecutive days a user has answered questions.
     *
     * @param {string} userEmail - The email of the user.
     * @returns {Promise<StreakModel>} - A promise that resolves to a StreakModel containing the current and longest streak.
     * @throws {Error} - If there is an error during the database query.
     *
     * @author Stijn Prent
     */
    public async getStreak(userEmail: string): Promise<StreakModel> {
        try {
            const results = await UserAnsweredQuestionTable.findAll({
                where: { user_email: userEmail },
                attributes: [[fn('DATE', col('timestamp')), 'dt']],
                group: ['dt'],
                order: [[literal('dt'), 'ASC']],
                raw: true
            }) as any[];

            const dates = results.map(r => {
                const d = new Date(r.dt);
                d.setHours(0, 0, 0, 0);
                return d;
            });

            if (dates.length === 0) {
                return new StreakModel(0, 0);
            }

            let longestStreak = 1;
            let currentLongest = 1;
            for (let i = 1; i < dates.length; i++) {
                const diffDays = (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                    currentLongest++;
                } else {
                    if (currentLongest > longestStreak) longestStreak = currentLongest;
                    currentLongest = 1;
                }
            }
            if (currentLongest > longestStreak) longestStreak = currentLongest;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let currentStreak = 0;
            for (let i = dates.length - 1; i >= 0; i--) {
                const diff = (today.getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24);
                if (diff === currentStreak) {
                    currentStreak++;
                } else if (diff > currentStreak) {
                    break;
                }
            }
            if (dates[dates.length - 1].getTime() !== today.getTime()) {
                currentStreak = 0;
            }
            return new StreakModel(currentStreak, longestStreak);
        } catch (error) {
            console.error("Error fetching streaks:", error);
            throw new Error("Database query failed.");
        }
    }

    public async getRecommendedTests(userEmail: string): Promise<TestModel[]> {
        try {
            const userClasses = await ClassHasUser.findAll({
                where: { user_email: userEmail },
                attributes: ['class_id']
            });

            const classIds = userClasses.map(userClass => userClass.class_id);

            if (classIds.length === 0) {
                return [];
            }

            const latestVisibleTests = await ClassHasTestTable.findAll({
                where: {
                    visible: true,
                    class_id: classIds
                },
                order: [['visible_date', 'DESC']],
                limit: 3,
                attributes: ['test_id']
            });

            const testIds = latestVisibleTests.map(test => test.test_id);

            if (testIds.length === 0) {
                return [];
            }

            const tests = await TestTable.findAll({
                where: { id: testIds },
                attributes: ['id', 'name', 'duration']
            });

            return tests.map(test => new TestModel(test.id, test.name, test.duration, true, []));
        } catch (error) {
            console.error("Error fetching recommended tests:", error);
            throw new Error("Database query failed.");
        }
    }
}