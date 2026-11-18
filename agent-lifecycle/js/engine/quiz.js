export function gradeAnswer(question, optionId) {
  const exists = question.options.some((o) => o.id === optionId);
  return { correct: exists && optionId === question.answer };
}
