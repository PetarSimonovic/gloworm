export const appendContent = (command: string, element: string) => {
  const newParagraph = document.createElement("p");
  newParagraph.textContent = command;
  const codeOutput = document.querySelector(element);
  codeOutput?.appendChild(newParagraph);
  scrollIntoView(element);
};

export const scrollIntoView = (element: string) => {
  const codeOutput = document.querySelector(element);

  // scroll codeOutput so the last item is visible
  codeOutput?.scrollTo(0, codeOutput.scrollHeight);
};
