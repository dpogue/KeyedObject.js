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

function Mesh() {
    this.vertpos = null;
    this.vertcol = null;
    this.indices = null;
    this.matrix = null;

    this.vbuffer = null;
    this.cbuffer = null;
    this.ibuffer = null;

    // Hacks for now
    this.lastUpdate = 0;
    this.rotation = 0.0;
}
Mesh.inherits(KeyedObject);

Mesh.prototype.read = function(data) {
    this.parent.read.call(this, data);

    if ('vertices' in data && data.vertices instanceof Array) {
        var pos = [];
        var col = [];
        data.vertices.forEach(function(a, b, c) {
            pos = pos.concat(a.position);
            col = col.concat(a.colour);
        });
        this.vertpos = new Float32Array(pos);
        this.vertcol = new Float32Array(col);
    }

    if ('indices' in data && data.indices instanceof Array) {
        var inds = data.indices.reduce(function(a, b) {
            return a.concat(b);
        });
        this.indices = new Uint16Array(inds);
    }

    if ('position' in data) {
        if (data.position[0] instanceof Array) {
            var pos = data.position.reduce(function(a, b) {
                return a.concat(b);
            });
            this.matrix = mat4.create(pos);
        } else {
            this.matrix = mat4.create(data.position);
        }
    }
}

Mesh.prototype.prep = function(gl) {
    this.vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertpos, gl.STATIC_DRAW);

    this.cbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertcol, gl.STATIC_DRAW);

    this.ibuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
}

Mesh.prototype.draw = function(gl, perspective) {
    var program = gl.getParameter(gl.CURRENT_PROGRAM);

    var vertposAttr = gl.getAttribLocation(program, "aVertexPosition");
    var vertcolAttr = gl.getAttribLocation(program, "aVertexColor");

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuffer);
    gl.vertexAttribPointer(vertposAttr, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cbuffer);
    gl.vertexAttribPointer(vertcolAttr, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibuffer);

    var pUniform = gl.getUniformLocation(program, "uPMatrix");
    var mvUniform = gl.getUniformLocation(program, "uMVMatrix");

    var rads = this.rotation * Math.PI / 180.0;
    var rotMat = mat4.create(this.matrix);
    rotMat = mat4.rotate(this.matrix, rads, [1, 0.5, 0.5], rotMat);

    gl.uniformMatrix4fv(pUniform, false, perspective);
    gl.uniformMatrix4fv(mvUniform, false, rotMat);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    var currentTime = (new Date()).getTime();
    if (this.lastUpdate) {
        var delta = currentTime - this.lastUpdate;

        this.rotation += (30 * delta) / 1000.0;
    }
    this.lastUpdate = currentTime;
}

gResMgr.register_class(1, Mesh);

if (typeof exports !== 'undefined') {
exports.Mesh = Mesh;
}
