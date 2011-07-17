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
var KeyedObject = require('./keyedobject.js').KeyedObject;
var gResMgr = require('./resmgr.js').gResMgr;
}

function Shader() {
    this.type = '';
    this.source = '';

    this.shader = null;
}
Shader.inherits(KeyedObject);

Shader.prototype.read = function(data) {
    this.parent.read.call(this, data);

    if (!('type' in data && 'source' in data)) {
        throw 'Incomplete Shader!';
    }

    if (data.type !== 'vertex' && data.type !== 'fragment') {
        throw 'Invalid shader type!';
    }

    this.type = data.type;
    this.source = data.source;
}

Shader.prototype.link = function(gl) {
    var shader = null;
    if (this.type === 'vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else if (this.type === 'fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else {
        throw 'Invalid shader type!';
    }

    gl.shaderSource(shader, this.source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Could not compile shader!');
        gl.deleteShader(shader);
        return false;
    }

    this.shader = shader;
    return true;
}

gResMgr.register_class(2, Shader);

if (typeof exports !== 'undefined') {
exports.Shader = Shader;
}
