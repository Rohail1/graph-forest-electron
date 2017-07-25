/**
 * Created by Rohail on 6/17/2017.
 */

const ipc = require('electron').ipcRenderer;
const csvParser = require('csvtojson');
const normalizer = require('../normalizers/skillMatricsNormalizer');

const selectDirBtn = document.getElementById('fileClicker');
const propsToSkip = ['Name','dob','Email','EmployeeID','Location',
  'University','Qualification','graduationYear','Certifications','totalVdExp','totalExp','TimeStamp','Major','OtherTools'];
const skillSetLevels = ['Beginner','Intermediate','Expert','None'];
selectDirBtn.addEventListener('click', function (event) {
  ipc.send('open-file-dialog')
});
let data = [];
ipc.on('selected-directory', function (event, path) {
  csvParser()
    .fromFile(path[0])
    .on('json',(jsonObj)=>{
      console.log('jsonObj',jsonObj);
      let normalizeJsonObj = normalizer.skillMatricsNormalizer(jsonObj);
      console.log('normalizeJsonObj',normalizeJsonObj);
      for(let prop in normalizeJsonObj){
        if(normalizeJsonObj.hasOwnProperty(prop))
          if(!propsToSkip.includes(prop)){
            if(normalizeJsonObj[prop] === "" || !skillSetLevels.includes(normalizeJsonObj[prop])){
              normalizeJsonObj[prop] = "None"
            }
          }
      }
      data.push(normalizeJsonObj);
    })
    .on('done',async (error)=>{
      if(!error){
        ipc.send('csvParsed',data);
      }
    })
});