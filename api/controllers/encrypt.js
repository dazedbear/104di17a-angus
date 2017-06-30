const bodyParser = require('body-parser')
const http = require("http")

function encrypt(req, res) {
    // check Content-type and Body has plaintext column
    if(!req.is("application/json")){
        res.json(400, { message: "request content-type must be application/json" })
    }else if(!req.body.hasOwnProperty("plaintext") || !req.body.plaintext){
        res.json(400, { message: "request body must have <plaintext> column" })
    }

    // check plaintext value: 
    // 1. hex encode  2. hex.length <= 16 (413)
    let input = req.body.plaintext,
        regHex = /[a-fA-F\d]+/g;

    if(input.length > 32){
        res.json(413, { message: "Entity Too Large" })
    }else if((input.length % 2) !== 0){
        res.json(400, { message: "illegal hex string with odd length" })
    }else if(!regHex.test(input)){
        res.json(400, { message: "contain illegal character in hex string" })
    }

    // request to remote API
    let postData = {
        'plaintext': input
    }
    postData.stringify({
        
    });

    let cipStr;
    http.request({
        host: 'nkiua09s52.execute-api.ap-northeast-1.amazonaws.com',
        path: '/dev/encrypt',
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        },
    }, (res) => {
        res.setEncoding("utf8");
        res.on("end", (data) => {
            // response result to client
            res.json(200, data)
        })
        res.on("error", () => {
            res.json(400, { message: "request for remote api error" })
        })
    })
}
 
module.exports = {
  encrypt,
}