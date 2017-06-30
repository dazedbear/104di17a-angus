const bodyParser = require('body-parser')
const request = require("request")

function encrypt(req, res) {
    // check Content-type and Body has plaintext column
    if(!req.is("application/json")){
        res.json(400, { message: "request content-type must be application/json" })
        return;
    }else if(!req.body.hasOwnProperty("plaintext") || !req.body.plaintext){
        res.json(400, { message: "request body must have <plaintext> column" })
        return;
    }

    // check plaintext value: 
    // 1. hex encode  2. hex.length <= 16 (413)
    let input = req.body.plaintext,
        regHex = /[a-fA-F\d]+\b/g;

    if(!regHex.test(input)){
        res.json(400, { message: "contain illegal character in hex string" })
        return;
    }else if((input.length % 2) !== 0){
        res.json(400, { message: "illegal hex string with odd length" })
        return;
    }else if(input.length > 32){
        res.json(413, { message: "Entity Too Large" })
        return;
    }

    request({
        uri: 'https://nkiua09s52.execute-api.ap-northeast-1.amazonaws.com/dev/encrypt ',
        method: 'POST',
        headers:{ 'Content-Type': 'application/json' },
        json: true,
        body:{ 'plaintext': input }
    }, (error, response, body) => {
        if(!error && response.statusCode === 200){
            res.json(200, body)
        }else{
            res.json(400, { message: "something error when request for remote api server"})
        }
    })
}
 
module.exports = {
  encrypt,
}