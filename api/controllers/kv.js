const Base64 = require("js-base64").Base64
const URLSafeBase64 = require("urlsafe-base64")
const bodyParser = require('body-parser')
const C = require("./collection.js")
var DB = C.Collection;

//let now = '2017-06-29T07:36:17.653Z'
let now = new Date();

function getKEY(req, res) {
  let url = req.url,
      result = checkUrl(url);
  // check url
  if(result.message !== undefined){
    res.json(400, { 
      message: result.message
    })
  }

  // process
  let key = url.substr(4),
      doc = DB.findOne(key);

  if(!doc){
    res.json(400, { 
      message: `Document with key ${key} cannot found.`
    })
  }else{
    res.json(400, { 
      "VALUE": Base64.encode(doc.value),
      "TS": now
    })
  }
}

function deleteKEY(req, res) {
  let url = req.url,
      result = checkUrl(url);
  // check url
  if(result.message !== undefined){
    res.json(400, { 
      message: result.message
    })
  }

  // findOneAndDelete
  let key = url.substr(4),
      oldValue = DB.findOneAndDelete(key);

  if(oldValue === false){
    res.json(400, { 
      message: `Document with key ${key} cannot found.`
    })
  }else{
    if(oldValue === null){
      res.json(200, {
        TS: now
      })
    }else{
      res.json(200, { 
        OLD_VALUE: Base64.encode(oldValue),
        TS: now
      })
    }
  }
}

function postKEY(req, res) {
  let url = req.url,
      result = checkUrl(url);
  // check url
  if(result.message !== undefined){
    res.json(400, { 
      message: result.message
    })
  }

  // check request header content-type is application/json
  if(!req.is("application/json")){
    res.json(400, { 
      message: "request for update must have content-type with application/json"
    })
  }
      
  // findOneAndDelete
  let key = url.substr(4),
      value = req.body.VALUE;
  if(DB.findOneAndUpdate(key, value)){
    res.json(200, {
      TS: now,
    }) 
  }else{
    res.json(400, { 
      message: `Post data error`
    })
  }
}

function checkUrl(url){
  // URI Format Check & convert base64 to urlbase64
  let regBase64Url = /\/kv\/[\w\+\-\/\_\=]+$/i;  // include base64, url safe base64
  if(!regBase64Url.test(url)){
    return new Error("Request Url Format Error! it must be a base64 encoded string")
  }else if(!URLSafeBase64.validate(url)){
    // convert base64 to urlbase64
    let s = Base64.decode(url);
    return URLSafeBase64.encode(s);
  }
}
 
module.exports = {
  getKEY,
  deleteKEY,
  postKEY,
}


