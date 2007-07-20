/*
 * Bring some _basic_ method into the native Array object if not already existent 
 */

if (!Array.prototype.contains) {
	Array.prototype.contains = function(search) {return base2.Array2.contains(this,search)};
}

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(block, context) {return base2.Array2.forEach(this, block, context)};
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(search, start) {return base2.Array2.indexOf(this,search, start)};
}

if (!Array.prototype.insertAt) {
	Array.prototype.insertAt = function(item, index) {return base2.Array2.insertAt(this, item, index)};
}

if (!Array.prototype.insertBefore) {
	Array.prototype.insertBefore = function(item, before) {return base2.Array2.insertBefore(this, item, before)};
}

if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function(item, fromIndex) {return base2.Array2.lastIndexOf(this, item, fromIndex)};
}

if (!Array.prototype.remove) {
	Array.prototype.remove = function(item) {return base2.Array2.remove(this, item)};
}

if (!Array.prototype.removeAt) {
	Array.prototype.removeAt = function(index) {return base2.Array2.removeAt(this, index)};
}

var gara = {};