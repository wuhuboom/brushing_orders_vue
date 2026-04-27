import { message } from "ant-design-vue";

const loadingKey = "app-global-loading-message";
const inviteCopyStackId = "invite-copy-toast-stack";

message.config({
  // Keep global toast/message under the fixed top bar on both H5 and PC.
  top: "72px",
  duration: 2,
  maxCount: 3,
});

const getContent = (options) => {
  if (options == null) return "";
  if (typeof options === "string" || typeof options === "number") return String(options);
  return options.message || options.content || "";
};

const getMessageConfig = (options, type) => {
  const content = getContent(options);
  if (!options || typeof options === "string" || typeof options === "number") {
    return content;
  }

  return {
    type,
    content,
    duration: options.duration,
    class: options.class || options.className,
    style: options.style,
    key: options.key,
  };
};

export const showToast = (options) => {
  message.info(getContent(options));
};

export const showSuccessToast = (options) => {
  const config = getMessageConfig(options, "success");
  if (typeof config === "string") {
    message.success(config);
  } else {
    message.open(config);
  }
};

export const showFailToast = (options) => {
  const config = getMessageConfig(options, "error");
  if (typeof config === "string") {
    message.error(config);
  } else {
    message.open(config);
  }
};

export const showLoadingToast = (options) => {
  message.open({
    key: loadingKey,
    type: "loading",
    content: getContent(options),
    duration: 0,
  });
};

export const closeToast = () => {
  message.destroy(loadingKey);
};

const ensureInviteCopyStack = () => {
  let stack = document.getElementById(inviteCopyStackId);
  if (!stack) {
    stack = document.createElement("div");
    stack.id = inviteCopyStackId;
    stack.className = "invite-copy-toast-stack";
    document.body.appendChild(stack);
  }
  return stack;
};

const removeInviteCopyToast = (toast) => {
  toast.classList.add("invite-copy-stack-toast--leaving");
  window.setTimeout(() => {
    toast.remove();
    const stack = document.getElementById(inviteCopyStackId);
    if (stack && stack.children.length === 0) {
      stack.remove();
    }
  }, 180);
};

export const showInviteCopySuccessToast = (options) => {
  if (typeof document === "undefined") {
    showSuccessToast(options);
    return;
  }

  const content = getContent(options);
  const stack = ensureInviteCopyStack();
  const toast = document.createElement("div");
  const rawDuration = Number(options?.duration || 4);
  const duration = rawDuration > 100 ? rawDuration : rawDuration * 1000;

  toast.className = "invite-copy-stack-toast";

  const icon = document.createElement("span");
  icon.className = "invite-copy-stack-toast__icon";
  icon.textContent = "✓";

  const text = document.createElement("span");
  text.className = "invite-copy-stack-toast__text";
  text.textContent = content;

  toast.appendChild(icon);
  toast.appendChild(text);
  stack.prepend(toast);

  while (stack.children.length > 5) {
    stack.lastElementChild?.remove();
  }

  let timer = null;
  const startTimer = () => {
    timer = window.setTimeout(() => removeInviteCopyToast(toast), duration);
  };

  toast.addEventListener("mouseenter", () => {
    if (timer) window.clearTimeout(timer);
  });
  toast.addEventListener("mouseleave", startTimer);
  startTimer();
};

export const appMessage = message;
