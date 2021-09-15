export const trimTextAndUpdatePosition = (textSlice: string, start: number, end: number) => {
  if (textSlice && start >= 0 && end > 0) {
    while (
      textSlice[0] === " " ||
      textSlice[textSlice.length - 1] === " " ||
      textSlice[0] === "\n" ||
      textSlice[textSlice.length - 1] === "\n"
    ) {
      if (textSlice[0] === " " || textSlice[0] === "\n") {
        textSlice = textSlice.slice(1);
        start += 1;
      }
      if (textSlice[textSlice.length - 1] === " " || textSlice[textSlice.length - 1] === "\n") {
        textSlice = textSlice.slice(0, textSlice.length - 1);
        end -= 1;
      }
    }
    return { textSlice, start, end };
  } else {
    return { textSlice: "", start: -1, end: -1 };
  }
};
