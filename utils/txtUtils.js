module.exports = {
  isBlank: function isBlank(str) {
      return (!str || /^\s*$/.test(str));
  }
}