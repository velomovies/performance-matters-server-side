module.exports = {
  init: function () {
    document.querySelectorAll('a').forEach(function (element) {
      if (element.innerHTML.search('park') > 0) {
        element.classList.add('park')
      } else {
        element.classList.add('plantsoen')
      }
    })
  }
}