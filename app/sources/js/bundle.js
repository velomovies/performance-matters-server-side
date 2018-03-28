(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
module.exports = {
  init: function () {
    if(!document.querySelector('.offline-page')) {
      if(!navigator.onLine) {
        document.body.insertAdjacentHTML('afterbegin', '<section class="offline"><p>U bent offline. Deze pagina is waarschijnlijk niet up to date</p></section>')
      }
  }
}
}
},{}],2:[function(require,module,exports){
module.exports = {
  init: function () {
    console.log('load')
  }
}
},{}],3:[function(require,module,exports){
const render = require('./render.js')
const error = require('./error.js')
const load = require('./load.js')

var app = {
  init: function () {
      render.init()
      error.init()
      load.init()
  }
};

app.init()
},{"./error.js":1,"./load.js":2,"./render.js":4}],4:[function(require,module,exports){
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
},{}]},{},[3]);
