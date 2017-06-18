/**
 * Created by Rohail on 6/17/2017.
 */

const ipc = require('electron').ipcRenderer;
const csvParser = require('csvtojson');

const selectDirBtn = document.getElementById('fileClicker');

selectDirBtn.addEventListener('click', function (event) {
  ipc.send('open-file-dialog')
});
let data = [];
ipc.on('selected-directory', function (event, path) {
  csvParser()
    .fromFile(path[0])
    .on('json',(jsonObj)=>{
      data.push(jsonObj);
    })
    .on('done',async (error)=>{
      if(!error){
        ipc.send('csvParsed',data);
      }
    })
});