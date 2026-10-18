(function () {
  "use strict";

  const app = document.documentElement.dataset.gambitApp || "app";
  const explicitLabels = {
    "todo-input": "Tên công việc mới",
    "new-subtask-input": "Tên việc con mới",
    "edit-input": "Tên công việc",
    "edit-subtask-input": "Tên việc con",
    searchInput: "Tìm kiếm",
    edTitle: "Tiêu đề nhật ký",
    edBody: "Nội dung nhật ký",
    calendarDate: "Ngày hiển thị",
    "n-db": "Daily Database ID",
    "n-habits-db": "Habits Database ID",
    "vol-rain": "Âm lượng mưa đêm",
    "vol-waves": "Âm lượng sóng biển",
    "vol-noise": "Âm lượng tiếng ồn hồng",
    "vol-cafe": "Âm lượng quán cà phê",
    "toggle-rain": "Bật hoặc tắt tiếng mưa đêm",
    "toggle-waves": "Bật hoặc tắt tiếng sóng biển",
    "toggle-noise": "Bật hoặc tắt tiếng ồn hồng",
    "toggle-cafe": "Bật hoặc tắt âm thanh quán cà phê"
  };

  function hasName(element) {
    return Boolean(
      element.getAttribute("aria-label") ||
      element.getAttribute("aria-labelledby") ||
      element.getAttribute("title") ||
      (element.textContent || "").trim()
    );
  }

  function inferButtonName(button) {
    if (explicitLabels[button.id]) return explicitLabels[button.id];
    const icon = button.querySelector("i[class*='ti-']");
    const classes = icon ? icon.className : button.className;
    const names = [
      ["search", "Tìm kiếm"], ["moon", "Đổi giao diện"], ["sun", "Đổi giao diện"],
      ["trash", "Xóa"], ["x", "Đóng"], ["refresh", "Làm mới"],
      ["play", "Bắt đầu"], ["check", "Hoàn thành"], ["edit", "Chỉnh sửa"],
      ["plus", "Thêm mới"], ["power", "Bật hoặc tắt"], ["menu", "Mở menu"]
    ];
    const match = names.find(([key]) => String(classes).includes(key));
    return match ? match[1] : "Thao tác";
  }

  function labelControls(root) {
    root.querySelectorAll("input:not([type='hidden']), select, textarea").forEach((control) => {
      const hasLabel = Boolean(
        control.getAttribute("aria-label") ||
        control.getAttribute("aria-labelledby") ||
        control.closest("label") ||
        (control.id && document.querySelector(`label[for="${CSS.escape(control.id)}"]`))
      );
      if (!hasLabel) {
        control.setAttribute(
          "aria-label",
          explicitLabels[control.id] || control.placeholder || control.name || "Trường nhập liệu"
        );
      }
      if (!control.name && control.id) control.name = control.id;
      if (!control.autocomplete && control.type !== "date" && control.type !== "range") {
        control.autocomplete = "off";
      }
    });

    root.querySelectorAll("button").forEach((button) => {
      if (!hasName(button)) button.setAttribute("aria-label", inferButtonName(button));
      button.querySelectorAll("i[class*='ti-'], svg").forEach((icon) => icon.setAttribute("aria-hidden", "true"));
    });
  }

  const actionableSelector = [
    ".set-row[onclick]", ".fab[onclick]", ".dcard[onclick]", ".tcard[onclick]",
    ".notion-card[onclick]", ".tab[onclick]", ".ecard[onclick]", ".mc[onclick]",
    ".fc[onclick]", ".irow[onclick]", ".icell[onclick]"
  ].join(",");

  function enableKeyboard(root) {
    root.querySelectorAll(actionableSelector).forEach((element) => {
      if (!element.hasAttribute("role")) element.setAttribute("role", "button");
      if (!element.hasAttribute("tabindex")) element.tabIndex = 0;
      if (element.dataset.keyboardReady) return;
      element.dataset.keyboardReady = "true";
      element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          element.click();
        }
      });
    });
  }

  function enhance(root) {
    labelControls(root);
    enableKeyboard(root);
    root.querySelectorAll(".toast, #toast").forEach((toast) => {
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
    });
  }

  function start() {
    enhance(document);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) enhance(node.parentElement || document);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.documentElement.classList.add("gambit-polished", `gambit-${app}`);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
