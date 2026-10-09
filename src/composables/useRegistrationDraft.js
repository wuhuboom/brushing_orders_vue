let registrationDraft = null;

export const useRegistrationDraft = () => {
  const saveDraft = (draft) => {
    registrationDraft = structuredClone(draft);
  };

  const takeDraft = () => {
    const draft = registrationDraft;
    registrationDraft = null;
    return draft;
  };

  const clearDraft = () => {
    registrationDraft = null;
  };

  return { saveDraft, takeDraft, clearDraft };
};
