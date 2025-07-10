// Users utilities
window.userUtils = {
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  },

  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  clearCurrentUser() {
    localStorage.removeItem('currentUser');
  }
};
