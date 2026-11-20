export async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Embedded browsers may deny the Clipboard API.
    }
  }
  const field = document.createElement("textarea");
  field.value = value;
  field.readOnly = true;
  Object.assign(field.style, { position: "fixed", opacity: "0" });
  document.body.appendChild(field);
  const focused = document.activeElement;
  try {
    field.select();
    if (!document.execCommand("copy")) throw new Error("copy failed");
  } finally {
    field.remove();
    focused?.focus({ preventScroll: true });
  }
}
