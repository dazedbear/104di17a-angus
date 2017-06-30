const Hash = require("string-hash")
const List = require("collections/list")
const Base64 = require("js-base64").Base64
const fs = require("fs")

module.exports = {
	Collection: new Collection(),  // object instance, cannot be constructor
}

// collection to save K-V
function Collection(){
  // hashIdx: hash value, value: LinkedList with DataItem
  this.hashIdx = {};
}

// open a local file to read data
Collection.prototype.connect = function(){
	// 暫時先不寫，最後再補
}

Collection.prototype.findOne = function(key){
	let idx = Hash(key),
			list = this.hashIdx[idx];

	if(!list || list.length === 0){
		// not found
		return false;
	}else{
		// include same hash idx, one hash idx
		// same hash index, compare origin key, return first match same keys
		let target = list.filter((doc) => doc.key === key).toArray();
		if(target.length > 1) console.log(`find result has multi same keys with docs: ${target}`);
		return (target.length === 0) ? false : target.shift();
	}
}

Collection.prototype.insertOne = function(key, value){
	let idx = Hash(key),
			list = this.hashIdx[idx],
			doc = new Document(key, value);

	if(!list){  
		this.hashIdx[idx] = new List();
		list = this.hashIdx[idx];
	}
	// append old list
	list.push(doc);
	return idx;  // return hash index
}

Collection.prototype.findOneAndUpdate = function(key, value){
	let idx = Hash(key),
			doc = new Document(key, value);

	if(!this.findOne(key)){
		return this.insertOne(key, value);
	}else{
		let list = this.hashIdx[idx];
		return list.some((item) => {
			if(item.key === doc.key){
				item.value = doc.value;
				return true;
			}
			return false;
		})
	}
}

Collection.prototype.findOneAndDelete = function(key){
	let idx = Hash(key);

	if(!this.findOne(key)){
		return new Error(`no document found with key: ${key}`);
	}else{
		let list = this.hashIdx[idx],
				target = list.filter((doc) => doc.key === key).toArray();
		
		let oldValue;
		list.some((item) => {
			if(item.key === key){
				oldValue = item.value;
				item.value = null;
				return true;
			}
			return false;
		})
		return (!oldValue) ? false : oldValue;
	}
}

// for every k-v store
// 相同雜湊值時要怎麼判別需求哪個？ =>  origin base64 相同
function Document(key, value){
	this.key = key;      // url-safe base64
	this.value = value;  // base64
}