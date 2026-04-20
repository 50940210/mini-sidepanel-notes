const textarea = document.querySelector("textarea");

textarea.addEventListener("input", () => {
  console.log("Current text:", textarea.value);
});