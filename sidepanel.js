const listView = document.getElementById("list-view");
const editorView = document.getElementById("editor-view");
const notesList = document.getElementById("notes-list");
const newNoteBtn = document.getElementById("new-note");
const backBtn = document.getElementById("back-btn");
const editor = document.getElementById("editor");

let notes = [];
let currentNoteId = null;

function canUseStorage() {
  return typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.local;
}

function saveNotes() {
  if (!canUseStorage()) {
    console.error("chrome.storage.local is unavailable");
    return;
  }

  chrome.storage.local.set({ notes });
}

function renderNotesList() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No notes yet.";
    notesList.appendChild(emptyItem);
    return;
  }

  notes.forEach((note) => {
    const li = document.createElement("li");
    li.className = "note-item";

    const title = document.createElement("div");
    title.className = "note-title";
    title.textContent = note.title || "Untitled Note";

    const preview = document.createElement("div");
    preview.className = "note-preview";
    preview.textContent = note.content
      ? note.content.slice(0, 60)
      : "Empty note";

    li.appendChild(title);
    li.appendChild(preview);

    li.addEventListener("click", () => {
      openEditor(note.id);
    });

    notesList.appendChild(li);
  });
}

function openEditor(noteId) {
  const note = notes.find((item) => item.id === noteId);
  if (!note) return;

  currentNoteId = noteId;
  editor.value = note.content || "";

  listView.style.display = "none";
  editorView.style.display = "block";
}

function goBackToList() {
  currentNoteId = null;
  editorView.style.display = "none";
  listView.style.display = "block";
  renderNotesList();
}

function createNewNote() {
  const newNote = {
    id: Date.now(),
    title: `Note ${notes.length + 1}`,
    content: ""
  };

  notes.unshift(newNote);
  saveNotes();
  openEditor(newNote.id);
  renderNotesList();
}

editor.addEventListener("input", () => {
  const note = notes.find((item) => item.id === currentNoteId);
  if (!note) return;

  note.content = editor.value;

  const trimmed = editor.value.trim();
  note.title = trimmed
    ? trimmed.split("\n")[0].slice(0, 20)
    : "Untitled Note";

  saveNotes();
});

newNoteBtn.addEventListener("click", createNewNote);
backBtn.addEventListener("click", goBackToList);

if (canUseStorage()) {
  chrome.storage.local.get({ notes: [] }, (result) => {
    notes = result.notes;
    renderNotesList();
  });
} else {
  console.error("chrome.storage.local is unavailable");
  renderNotesList();
}