import { createRoot } from "react-dom/client";

export default function renderOnDomLoaded(component, elementId) {
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById(elementId)) {
      createRoot(document.getElementById(elementId)).render(component)
    }
  });
}
