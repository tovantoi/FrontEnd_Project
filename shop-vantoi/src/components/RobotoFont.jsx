// RobotoFont.js
export const robotoBase64 = `...DÒNG DÀI BASE64 ĐẦY ĐỦ...`;

export const registerRobotoFont = (doc) => {
  doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
};
