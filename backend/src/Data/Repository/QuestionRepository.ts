import QuestionTable from "../Tables/QuestionTable";
import AnswerTable from "../Tables/AnswerTable";
import UserAnsweredQuestionTable from "../Tables/UserAnsweredQuestionTable";
import { NewQuestionModel } from "../../Business/Models/NewQuestionModel";
import { IQuestionRepository } from "../Interfaces/IQuestionRepository";
import { TeacherQuestionModel } from "../../Business/Models/TeacherQuestionModel";
import { Transaction } from "sequelize";
import LearningObjectiveTable from "../Tables/LearningObjectiveTable";
import QuestionTypeTable from "../Tables/QuestionTypeTable";
import { LearningObjectiveRepository } from "./LearningObjectiveRepository";
import { AnswerRepository } from "./AnswerRepository";
import { HintRepository } from "./HintRepository";

export class QuestionRepository implements IQuestionRepository {
    private answerRepository: AnswerRepository;
    private hintRepository: HintRepository;

    constructor(answerRepository: AnswerRepository, hintRepository: HintRepository) {
        this.answerRepository = answerRepository;
        this.hintRepository = hintRepository;
    }

    /**
     * @author Roan Slingerland
     * @param id questionID
     * @returns this mehtod queries for a question based on the given ID, and returns the questionID, the question itself and the correct answer to the question.
     */
    public async getQuestionAndAnswerById(id: number): Promise<NewQuestionModel> {
        try {
            const results = await QuestionTable.findOne({
                where: {
                    id: id
                },
                include: [
                    {
                        model: AnswerTable,
                        through: { attributes: [] },
                        attributes: ["answer"],
                        where: {
                            correct_answer: true
                        }
                    },
                ],
            });

            if (!results) {
                throw new Error("Question not found.");
            }

            const possibleAnswers = results.answers;
            const correctAnswer: string = possibleAnswers[0].dataValues.answer;

            return new NewQuestionModel(
                results.id,
                results.question,
                correctAnswer,
            );
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong.");
        }
    }

    public async getPossibleQuestionAnswersById(questionId: number): Promise<string[]> {
        try {
            const results = await QuestionTable.findOne({
                where: {
                    id: questionId,
                },
                include: [
                    {
                        model: AnswerTable,
                        through: { attributes: [] },
                        attributes: ["answer"]
                    },
                ],
            });

            if (!results) {
                //!! Working with an outdated branch so this error needs to be replaced with the custommade "NotFound" error later.
                throw new Error("No answers found.");
            }

            return results.answers.map(answer => answer.answer);
        } catch (error) {
            //!! Working with an outdated branch so this error needs to be replaced with the custommade "DatabaseError" error later.
            throw new Error("Something went wrong.");
        }
    }

    /**
    * @author Max Sijbrands
    */
    public async saveStudentAnswer(userEmail: string, questionId: number, answer: string): Promise<void> {
        try {
            await UserAnsweredQuestionTable.create({
                timestamp: new Date(),
                questionId: questionId,
                answer: answer,
                user_email: userEmail,
            });
        } catch (error) {
            throw new Error("Error saving student answer.");
        }
    }

    /**
    * @author Luka Piersma
    */
    public async upsertQuestionTable(questionModel: TeacherQuestionModel, transaction: Transaction): Promise<QuestionTable> {
        const questionType = await QuestionTypeTable.findOne({
            where: { question_type: questionModel.type }
        });

        const answers = [];

        for (const a of questionModel.answers) {
            const answer = await this.answerRepository.upsertAnswerTable(a, transaction);

            answers.push(answer);
        }

        const hints = [];

        for (const h of questionModel.hints) {
            const hint = await this.hintRepository.upsertHintTable(h, transaction);

            hints.push(hint);
        }

        const [question] = await QuestionTable.upsert({
            id: questionModel.id,
            question_type_id: questionType?.id,
            question: questionModel.question
        });

        await question.$set('answers', answers, { transaction });
        await question.$set('hints', hints, { transaction });

        return question;
    }
}
