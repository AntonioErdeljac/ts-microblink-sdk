const updateField = (id: string, value: string) => {
  const element = document.getElementById(id) as HTMLInputElement;

  if (!element) {
    return;
  }

  element.value = value;
};

export default updateField;
