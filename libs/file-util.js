
function saveFile(blob_data, filename) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var url = window.URL.createObjectURL(blob_data);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
};

function loadFile() {
  return new Promise(function (resolve, reject) {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = function(){
      let reader = new FileReader();
      reader.onload = function(e) {
        resolve(e.target.result);
      }
    	reader.readAsText(input.files[0]);
    };
    input.click();
  });
}

module.exports = {
  saveFile,
  loadFile
};