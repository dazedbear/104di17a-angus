const URLSafeBase64 = require("urlsafe-base64")
let now = '2017-06-29T07:36:17.653Z'

function getKEY(req, res) {
  // check
    // out-spec check
      // abnormal input

    // in-spect check
      // KvKey base64 format
      // 
    
  // process
    // find
      // hashmap search
    // not-found

  // response
  res.json(404, {
    VALUE: "hello world",
    TS: now,
  })
}

function deleteKEY(req, res) {
  // check
  // findOneAndDelete
  // response
  res.json(200, {
    TS: now,
  })
}

function postKEY(req, res) {
  // check
  // findOneAndUpdata or insertOne
  res.json(200, {
    TS: now,
  })
}

module.exports = {
  getKEY,
  deleteKEY,
  postKEY,
}


