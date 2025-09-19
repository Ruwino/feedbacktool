import { Transaction } from "sequelize";
import { TeacherHintModel } from "../../Business/Models/TeacherHintModel";
import HintTable from "../Tables/HintTable";

export class HintRepository  {
  /**
  * @author Luka Piersma
  */
  public async upsertHintTable(hintModel: TeacherHintModel, transaction: Transaction): Promise<HintTable> {
    const [hint] = await HintTable.upsert(
      {
        id: hintModel.id,
        hint: hintModel.hint
      },
      { transaction }
    );

    return hint;
  }

    /**
  * @author Luka Piersma
  */
  public async updateHintTable(hintModel: TeacherHintModel, transaction: Transaction): Promise<HintTable> {
    const hint = await HintTable.findByPk(hintModel.id);

    if (!hint) throw new Error('HintTable was not found');

    hint.update(
      {
        hint: hintModel.hint
      },
      { transaction }
    );

    return hint;
  }
}