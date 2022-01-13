const element = (tag, classes, content) => {
  const node = document.createElement(tag);

  if (classes.length) {
    node.classList.add(...classes);
  }
  if (content) {
    node.textContent = content;
  }
  return node;
};

export const upload = (selector, options = {}) => {
  let files = [];

  const input = document.querySelector(selector);
  const preview = element("div", ["preview"]);
  const openButton = element("button", ["btn"], "Выбрать");
  const uploadButton = element("button", ["btn", "primary"], "Загрузить");
  uploadButton.style.display = "none";

  if (options.multi) {
    input.setAttribute("multiple", true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute("accept", options.accept.join(","));
  }

  input.insertAdjacentElement("afterend", preview);
  input.insertAdjacentElement("afterend", uploadButton);
  input.insertAdjacentElement("afterend", openButton);

  const triggerInput = () => input.click();

  const changeHandler = (e) => {
    if (!e.target.files.length) {
      return;
    }
    files = Array.from(e.target.files);
    preview.innerHTML = "";
    uploadButton.style.display = "inline";

    files.forEach((file) => {
      if (!file.type.match("image")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        // const src = e.target.result;

        preview.insertAdjacentHTML(
          "afterbegin",
          `<div class="attachment__item">
            <div class="attachment__row">
              <div class="attachment__image">
                <img src="src/attachment.svg" alt="" />
                <span> ${file.name} </span>
              </div>
              <div class="attachment__icon preview-remove" >
                <img src="src/trash.svg" alt="" />
                <span> Удалить </span>
              </div>
            </div>
          </div>`
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const removeHandler = (e) => {
    if (!e.target.dataset.name) return;

    const { name } = e.target.dataset;
    files = files.filter((file) => file.name !== name);

    if (!files.length) {
      uploadButton.style.display = "none";
    }

    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest(".attachment__item");

    block.classList.add("removing");
    setTimeout(() => {
      block.remove();
    }, 300);
  };

  openButton.addEventListener("click", triggerInput);
  input.addEventListener("change", changeHandler);
  preview.addEventListener("click", removeHandler);
  uploadButton.addEventListener("click", uploadHandler);

};

function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
