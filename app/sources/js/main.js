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