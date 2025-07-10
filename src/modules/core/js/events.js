// Events utilities
window.eventUtils = {
  on(element, event, handler) {
    if (element && element.addEventListener) {
      element.addEventListener(event, handler);
    }
  },

  off(element, event, handler) {
    if (element && element.removeEventListener) {
      element.removeEventListener(event, handler);
    }
  }
};
