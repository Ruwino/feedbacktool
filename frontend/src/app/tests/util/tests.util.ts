// src/app/testing/test-utils.ts
import { TestModel } from '../models/test.model';
import { QuestionModel } from '../models/question.model';
import { AnswerModel } from '../models/answer.model';
import { QuestionType } from '../enums/questionType.enum';
import { ObjectiveModel } from '../models/objective.model';

export function createValidTestModel(params?: {
    learningObjectives?: ObjectiveModel[],
    questions?: QuestionModel[]
}) {
    return new TestModel({
        name: 'Test',
        subject: 'A1',
        learningObjectives: params?.learningObjectives || [new ObjectiveModel({name: 'Objective 1'}), new ObjectiveModel({name: 'Objective 2'})],
        questions: params?.questions || [new QuestionModel({
            type: QuestionType.MultipleChoice,
            name: 'Question 1',
            learningObjectiveIndex: 0,
            answers: [
                new AnswerModel({
                    name: 'Answer 1',
                    correct: true
                }),
                new AnswerModel({
                    name: 'Answer 2',
                    correct: false
                })
            ],
            hints: [],
        }),
        new QuestionModel({
            type: QuestionType.Open,
            name: 'Question 2',
            learningObjectiveIndex: 1,
            answers: [
                new AnswerModel({
                    name: 'Answer 1',
                    correct: true
                })
            ],
            hints: []
        })],
        randomized: false,
        duration: 60
    });
}
