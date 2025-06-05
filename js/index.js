const Bookmark = {
  bookmarks: [],

  load: function () {
    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      try {
        this.bookmarks = JSON.parse(storedBookmarks) || [];
      } catch (error) {
        console.error("Error parsing bookmarks from localStorage:", error);
        localStorage.removeItem("bookmarks");
        this.bookmarks = [];
      }
    }
  },
  commit: function () {
    localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
  },
  add: function (bookmark) {
    this.bookmarks.push(bookmark);
    this.commit();
  },
  remove: function (index) {
    this.bookmarks.splice(index, 1);
    this.commit();
  },
  get: function (index) {
    return this.bookmarks[index];
  },
  getAll: function () {
    return this.bookmarks;
  },
  nextIndex: function () {
    return this.bookmarks.length - 1;
  },
};

function addBookmarkRow(bookmark) {
  const tr = document.createElement("tr");
  addTextCell(tr, bookmark.index + 1);
  addTextCell(tr, bookmark.name);
  addButtonCell(tr, "Visit", {
    onclick: function () {
      window.open(bookmark.url, "_blank");
    },
    className: "btn btn-dark",
  });
  addButtonCell(tr, "Delete", {
    onclick: function () {
      Bookmark.remove(bookmark.index);
      tr.remove();
    },
    className: "btn btn-danger",
  });
  return tr;
}

function addTextCell(tr, text) {
  const td = document.createElement("td");
  td.textContent = text;
  tr.appendChild(td);
}

function addButtonCell(tr, text, option = {}) {
  const td = document.createElement("td");
  const button = document.createElement("button");
  button.textContent = text;
  Object.entries(option).forEach(([key, value]) => {
    button[key] = value;
  });
  td.appendChild(button);
  tr.appendChild(td);
}

function showErrorAlert(errors) {
  errorsList = document.getElementById("errorsList");
  errorsList.innerHTML = "";
  errors.forEach((error) => {
    const li = document.createElement("li");
    li.textContent = error;
    li.className = "fa-regular fa-circle-right p-2";
    const icon = document.createElement("i");
    icon.className = "fa-regular fa-circle-right p-2";
    li.prepend(icon);
    errorsList.appendChild(li);
  });
  // Show the modal
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

function init() {
  Bookmark.load();
  const bookmarkList = document.querySelector("#bookmarkList tbody");
  console.log(bookmarkList);

  const bookmarks = Bookmark.getAll();

  for (let i = 0; i < bookmarks.length; i++) {
    const bookmark = bookmarks[i];
    const tr = addBookmarkRow({ ...bookmark, index: i });
    console.log(tr);

    bookmarkList.appendChild(tr);
  }
}

function validateInput(name, url) {
  const errors = [];
  if (!name || name.trim() === "") {
    errors.push("Name cannot be empty.");
  }
  if (!url || url.trim() === "") {
    errors.push("URL cannot be empty.");
  }
  if (url && !/^https?:\/\/.+/i.test(url)) {
    errors.push("URL must start with http:// or https://");
  }
  return errors;
}

// Add event listener for the form submission

document.addEventListener("DOMContentLoaded", function () {
  console.log("Document loaded, initializing bookmarks...");
  init();
  document
    .getElementById("bookmarkForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("siteName").value;
      const url = document.getElementById("siteUrl").value;
      const errors = validateInput(name, url);
      if (errors.length === 0) {
        const bookmarkList = document.querySelector("#bookmarkList tbody");

        const bookmark = { name, url };
        Bookmark.add(bookmark);
        const tr = addBookmarkRow({ ...bookmark, index: Bookmark.nextIndex() });
        bookmarkList.appendChild(tr);
        this.reset();
      } else {
        // will do a modal that show the errors here.
        showErrorAlert(errors);
      }
    });
});
