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
var Mesh = require('./mesh.js').Mesh
var gResMgr = require('./resmgr.js').gResMgr;
}

function World() {
    this.objects = [];
    this.shaders = [];
    this.gl = null;
}
World.inherits(KeyedObject);

World.prototype.read = function(data) {
    this.parent.read.call(this, data);

    if ('shaders' in data && data.shaders instanceof Array) {
        for (var i in data.shaders) {
            var skey = new Key();
            skey.read(data.shaders[i]);
            var obj = gResMgr.find_or_create(skey);
            this.shaders.push(obj);
        }
    }

    if ('objects' in data && data.objects instanceof Array) {
        for (var i in data.objects) {
            var okey = new Key();
            okey.read(data.objects[i]);
            var obj = gResMgr.find_or_create(okey);
            this.objects.push(obj);
        }
    }
}

World.prototype.add_object = function(obj) {
    if (obj && obj instanceof Mesh) {
        this.objects.push(obj);
    }
}

World.prototype.init = function(canvas) {
    try {
        this.gl = canvas.getContext('experimental-webgl');
    } catch (e) {
        console.error('Could not get GL context');
        return false;
    }

    if (!this.gl) {
        console.error('Could not get GL context (null)');
        return false;
    }

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    var program = this.gl.createProgram();
    for (var shader in this.shaders) {
        if (this.shaders[shader].link(this.gl)) {
            this.gl.attachShader(program, this.shaders[shader].shader);
        }
    }
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        this.gl.deleteProgram(program);
        for (var shader in this.shaders) {
            if (this.shaders[shader].shader) {
                this.gl.deleteShader(this.shaders[shader].shader);
            }
        }
        console.error('Could not get compile and link shaders');
        return false;
    }

    this.gl.useProgram(program);

    var vertposAttr = this.gl.getAttribLocation(program, "aVertexPosition");
    this.gl.enableVertexAttribArray(vertposAttr);

    var vertcolAttr = this.gl.getAttribLocation(program, "aVertexColor");
    this.gl.enableVertexAttribArray(vertcolAttr);

    for (var mesh in this.objects) {
        this.objects[mesh].prep(this.gl);
    }

    return true;
}

World.prototype.render = function() {
    if (!this.gl) {
        console.error('No GL context!');
        return;
    }

    this.gl.viewport(0, 0, 800, 600);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    var perspective = mat4.perspective(30.0, (800.0 / 600.0), 1.0, 10000.0);

    for (var obj in this.objects) {
        this.objects[obj].draw(this.gl, perspective);
    }
}

gResMgr.register_class(0, World);

if (typeof exports !== 'undefined') {
exports.World = World;
}
