/* Copyright (c) 2011 Darryl Pogue
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

if (typeof require !== 'undefined') {
require.paths.shift('.');
var Key = require('./key.js').Key;
var ResManager = require('./resmgr.js').ResManager
var gResMgr = require('./resmgr.js').gResMgr;
}

/* A slight hack to allow us to more-easily inherit from KeyedObjects */
Function.prototype.inherits = function(klass) {
    if (klass.constructor == Function) {
        this.prototype = new klass;
        this.prototype.constructor = this;
        this.prototype.parent = klass.prototype;
    } else {
        this.prototype = klass;
        this.prototype.constructor = this;
        this.prototype.parent = klass;
    }
    return this;
}


KeyedObject = function() {
    this._key = null;
    this._loaded = false;
}

KeyedObject.prototype.key = function(newkey) {
    if (!newkey) {
        return this._key;
    }

    if (!this._key) {
        this._key = new Key();
    }
    this._key.read(newkey);
}

KeyedObject.prototype.read = function(data) {
    if (!('key' in data)) {
        throw 'Tried to read an object without a key!';
    }

    var newkey = new Key();
    newkey.read(data.key);

    if (this._key && !newkey.equals(this._key)) {
        throw 'Tried to change the key of an object!';
    }
    this._key.read(newkey);
}

if (typeof exports !== 'undefined') {
exports.KeyedObject = KeyedObject;
}
