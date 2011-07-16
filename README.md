KeyedObject.js
==============
A Keyed-Object, Resource Manager, and Factory implementation for JavaScript.
This project aims to be usable both in-browser as well as through Node.js.

In-Browser
----------
The include order is important when being used in a browser:

```html
<script src="./key.js"></script>
<script src="./resmgr.js"></script>
<script src="./keyedobject.js"></script>
<!-- Put your class definitions here:
<script src="./example/person.js"></script>
-->
<!-- Put your loading/init code here -->
```

Future plan is to have a script that will either load these dynamically, or concatenate and minify them.

Node.js
-------
With Node, you'll need to include all of your class definitions.
To actually use the majority of the functionality, you only need to store the global resource manager:

```javascript
/* Require classes here:
require('./example/person.js');
*/
gResMgr = require('./resmgr.js').gResMgr;
// Your loading code here
```

Example Usage
=============
```javascript
var myobj = '{"key": {"type": 0, "index": 0}, "name": "John Doe"}';
var obj = gResMgr.read(JSON.parse(myobj));

var k = new Key();
k.read({type: 0, index: 0});
var o2 = gResMgr.find(k);

console.log("Same object? " + (obj == o2));
```
