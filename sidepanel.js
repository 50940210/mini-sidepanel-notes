const textarea = document.querySelector("textarea");

function cleanPastedText(text) {
  return text
    // 去掉常见分隔线
    .replace(/^---$/gm, "")
    .replace(/^___$/gm, "")
    .replace(/^\*\*\*$/gm, "")
    // 去掉多余的奇怪连续标点
    .replace(/[、]{3,}/g, "")
    .replace(/[.]{3,}/g, "...")
    // 把 3 个及以上空行压成 2 个
    .replace(/\n{3,}/g, "\n\n")
    // 去掉每行末尾多余空格
    .replace(/[ \t]+$/gm, "")
    // 去掉整体首尾空白
    .trim();
}

textarea.addEventListener("paste", (event) => {
  event.preventDefault();

  const pastedText = (event.clipboardData || window.clipboardData).getData("text");
  const cleanedText = cleanPastedText(pastedText);

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const currentValue = textarea.value;

  textarea.value =
    currentValue.slice(0, start) +
    cleanedText +
    currentValue.slice(end);

  const newCursorPosition = start + cleanedText.length;
  textarea.setSelectionRange(newCursorPosition, newCursorPosition);
});

textarea.addEventListener("input", () => {
  console.log("Current text:", textarea.value);
});