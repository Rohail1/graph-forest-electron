/**
 * Created by Rohail on 6/17/2017.
 */

const ipc = require('electron').ipcRenderer;
const csvParser = require('csvtojson');

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
      for(let prop in jsonObj){
        if(jsonObj.hasOwnProperty(prop))
          if(!propsToSkip.includes(prop))
            if(jsonObj[prop] === "" || !skillSetLevels.includes(jsonObj[prop]))
              jsonObj[prop] = "None"
      }
      data.push(jsonObj);
    })
    .on('done',async (error)=>{
      if(!error){
        ipc.send('csvParsed',data);
      }
    })
});