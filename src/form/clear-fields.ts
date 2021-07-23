import updateField from './update-field';

const clearFields = (...ids: string[]) => {
  ids.forEach((id) => {
    updateField(id, null);
  });
};

export default clearFields;
