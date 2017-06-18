/**
 * Created by Rohail on 6/18/2017.
 */

const dc = require('dc');
const ipc = require('electron').ipcRenderer;
const crossFilterClass = require('../scripts/initGraphs');
const homeBtn = document.getElementById('homebtn');


let totalExpChart;
let vdExpChart;
let table;
let graphs;

const propsToRemove  = ['Name','dob','University','graduationYear','totalExp','totalVdExp','Timestamp','OtherTools','EmployeeID'];

homeBtn.addEventListener('click', function (event) {
  ipc.send('home-screen')
});

const homeLogo = document.getElementById('homelogo');

homeLogo.addEventListener('click', function (event) {
  ipc.send('home-screen')
});

ipc.on('graphData', function (event,data) {
  crossFilterClass.initializeCrossFilter(data);
  Object.keys(data.reduce(function (a, b) { return Object.keys(a).length > Object.keys(b).length ? a : b; }))
    .filter(function (element) {
      return !propsToRemove.includes(element)
    }).forEach(props =>{

    function eventMethod () {
      graphs = require('../scripts/initGraphs').addGraph(props)
    }

    let button = document.createElement("button");
    button.id = props;
    button.innerHTML = props;
    button.className   = "btn btn-success paddingClass";
    button.onclick = eventMethod;  //require('../scripts/initGraphs').addGraph;
    document.getElementById('skillSetDiv').appendChild(button);
  });
  totalExpChart = crossFilterClass.initializePieChart('totalExpPie','totalExp');
  vdExpChart = crossFilterClass.initializePieChart('VdExpPie','totalVdExp');
  table = crossFilterClass.initializeTable('table',totalExpChart.chartDimension,['Name','dob','University','totalExp'],'Name');

});
