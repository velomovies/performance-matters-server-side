module.exports = {
  init: function () {
    if(!document.querySelector('.offline-page')) {
      if(!navigator.onLine) {
        document.body.insertAdjacentHTML('afterbegin', '<section class="offline"><p>U bent offline. Deze pagina is waarschijnlijk niet up to date</p></section>')
      }
  }
}
}