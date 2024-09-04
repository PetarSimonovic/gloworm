export const appendPara = (command: string, element: string) => {
  const newParagraph = document.createElement("p");
  newParagraph.textContent = command;
  const codeOutput = document.querySelector(element);
  codeOutput?.appendChild(newParagraph);
};
