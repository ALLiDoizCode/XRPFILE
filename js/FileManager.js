var inputElement = document.getElementById("document");
  inputElement.addEventListener("change", handleFiles, false);
  var image = document.getElementById("image");
  var fileReader = new FileReader();
  var previous = [];
  var chunks = [];
  var partial;
  var type;
  function handleFiles() {
    var file = this.files[0];
    type = file.type
    console.log(file.type);
    if(file===undefined){
        return;
    }

    var counter = 0;
    var self = this;
    loading(file,
      function (data) {
          counter += data.byteLength;
          console.log((( counter / file.size)*100).toFixed(0) + '%');
      }, function () {
        var tmp = new Uint8Array()
        chunks.forEach(function(chunk){
            console.log(chunk)
          tmp = _appendBuffer(tmp,hexToArrayBuffer(chunk))
        })
        var base = "data:"+type+";base64,"+base64ArrayBuffer(tmp)
        console.log(tmp)
        console.log(base)
        image.src = base
        console.log('100% Done');
        var fileReader = new FileReader();

        fileReader.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            console.log(fileReader.result);     
          }
        };

        fileReader.readAsDataURL(file);
          
    });
  }

  function loading(file, callbackProgress, callbackFinal) {
   var chunkSize  = 500; // bytes
   var offset     = 0;
   var size=chunkSize;
   
   var index = 0;

   if(file.size===0){
      callbackFinal();
   }
   while (offset < file.size) {
      partial = file.slice(offset, offset+size,type);
      var reader = new FileReader;
      reader.size = chunkSize;
      reader.offset = offset;
      reader.index = index;
      reader.onload = function(evt) {
         var chunk = evt.target.result;
         chunks.push(buf2hex(chunk));
         callbackRead(this, file, evt, callbackProgress, callbackFinal);
      };
      reader.readAsArrayBuffer(partial);
      offset += chunkSize;
      index += 1;
   }
}
  var lastOffset = 0;
  function callbackRead(reader, file, evt, callbackProgress, callbackFinal){

    if(lastOffset !== reader.offset){
        // not of order chunk: put into buffer
        previous.push({ offset: reader.offset, size: reader.size, result: reader.result});
        return;
    }

    function parseResult(offset, size, result) {
        lastOffset = offset + size;
        callbackProgress(result);
        if (offset + size >= file.size) {
            lastOffset = 0;
            callbackFinal();
        }
    }

    // in order chunk
    parseResult(reader.offset, reader.size, reader.result);

    // check previous buffered chunks
    var buffered = [{}]
    while (buffered.length > 0) {
        buffered = previous.filter(function (item) {
            return item.offset === lastOffset;
        });
        buffered.forEach(function (item) {
            parseResult(item.offset, item.size, item.result);
            previous.remove(item);
        })
    }

  }

  Array.prototype.remove = Array.prototype.remove || function(val){
    var i = this.length;
    while(i--){
        if (this[i] === val){
            this.splice(i,1);
        }
    }
  }
  /*var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function (event) {
    var data = event.target.result;
    console.log('Data: ' + data);
  };
  reader.readAsBinaryString(file);*/
 