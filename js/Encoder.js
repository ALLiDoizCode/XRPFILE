if (!("TextEncoder" in window)) 
  alert("Sorry, this browser does not support TextEncoder...");

if (!("TextDecoder" in window))
  alert("Sorry, this browser does not support TextDecoder...");


function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function hexToArrayBuffer(str){
    var typedArray = new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))

    return typedArray
}

function decodeArrayBuffer(uint8array){
    var string = new TextDecoder("utf-8").decode(uint8array);
    return string
}

    /**
 * Creates a new Uint8Array based on two different ArrayBuffers
 *
 * @private
 * @param {ArrayBuffers} buffer1 The first buffer.
 * @param {ArrayBuffers} buffer2 The second buffer.
 * @return {ArrayBuffers} The new ArrayBuffer created out of the two.
 */
var _appendBuffer = function(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  };
  