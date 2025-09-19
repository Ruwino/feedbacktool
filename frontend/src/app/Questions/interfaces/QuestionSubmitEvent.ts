export interface QuestionSubmitEvent {
  questionId: number,
  answer: string,
  success: (hint?: string) => void
}