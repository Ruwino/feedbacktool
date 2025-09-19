import QuestionTypeTable from '../Data/Tables/QuestionTypeTable';
import UserTypeTable from '../Data/Tables/UserTypeTable';
import SubjectTable from '../Data/Tables/SubjectTable';

import { QuestionType } from '../Enums/QuestionType';
import { SubjectType } from '../Enums/SubjectType';
import { UserType } from '../Enums/UserType';

export const seedDatabase = async (logging: boolean = false) => {
    try {
        for (const type of Object.values(UserType)) {
            await UserTypeTable.findOrCreate({
                where: { name: type },
                defaults: { name: type }
            });
        }
        if (logging) {
            console.log('UserTypeTable seeded successfully!');
        }

        for (const type of Object.values(QuestionType)) {
            await QuestionTypeTable.findOrCreate({
                where: { question_type: type },
                defaults: { question_type: type }
            });
        }

        for (const type of Object.values(SubjectType)) {
            await SubjectTable.findOrCreate({
                where: { name: type },
                defaults: { name: type }
            });
        }
        
        if (logging) {
            console.log('QuestionTypeTable seeded successfully!');
        }


    } catch (error) {
        console.error('Error seeding data:', error);
    }
};
