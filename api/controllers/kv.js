let now = '2017-06-29T07:36:17.653Z'

function getKEY(req, res) {
  res.json(404, {
    VALUE: "hello world",
    TS: now,
  })
}

function deleteKEY(req, res) {
  res.json(200, {
    TS: now,
  })
}

function postKEY(req, res) {
  res.json(200, {
    TS: now,
  })
}

module.exports = {
  getKEY,
  deleteKEY,
  postKEY,
}
