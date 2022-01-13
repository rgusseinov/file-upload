import { upload } from "./src/upload";

upload("#file", {
  multi: true,
  accept: [".jpg", ".png", "jpeg", ".gif"],
});