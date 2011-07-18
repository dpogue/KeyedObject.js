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
var Key = require('../key.js').Key;
var ResManager = require('../resmgr.js').ResManager
var gResMgr = require('../resmgr.js').gResMgr;
var KeyedObject = require('../keyedobject.js').KeyedObject;
}

function Person() {
    this.name = null;
}
Person.inherits(KeyedObject);
Person.prototype.ClsIdx = 0;

Person.prototype.read = function(data) {
    this.parent.read.call(this, data);

    if ('name' in data) {
        this.name = data.name;
    }
}

Person.prototype.get_name = function() {
    return this.name;
}

Person.prototype.set_name = function(name) {
    this.name = name;
}

gResMgr.register_class(Person);

if (typeof exports !== 'undefined') {
exports.Person = Person;
}
