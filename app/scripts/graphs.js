/**
 * Created by Rohail on 6/18/2017.
 */

const dc = require('dc');
const ipc = require('electron').ipcRenderer;
const json2xls = require('json2xls');
const fs = require('fs');
const crossFilterClass = require('../scripts/initGraphs');
const homeBtn = document.getElementById('homebtn');
const homeLogo = document.getElementById('homelogo');
const refreshBtn = document.getElementById('refresh');


let graphData;
let totalExpChart;
let vdExpChart;
let table;
let graphs;

const propsToRemove  = ['Name','dob','Email','University','graduationYear','totalExp','totalVdExp','Timestamp','OtherTools','EmployeeID','Major'];

homeBtn.addEventListener('click', function (event) {
  ipc.send('home-screen')
});
refreshBtn.addEventListener('click', function (event) {
  ipc.send('refresh-screen',graphData)
});


homeLogo.addEventListener('click', function (event) {
  ipc.send('home-screen')
});

ipc.on('graphData', function (event,data) {
  graphData = data;
  crossFilterClass.initializeCrossFilter(data);
  Object.keys(data.reduce(function (a, b) { return Object.keys(a).length > Object.keys(b).length ? a : b; }))
    .filter(function (element) {
      return !propsToRemove.includes(element)
    }).forEach(props =>{

    function eventMethod () {
      let graphObject = require('../scripts/initGraphs').addGraph(props);
      graphs = graphObject.graphs;
      table = graphObject.table;
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
  table = crossFilterClass.initializeTable('table',totalExpChart.chartDimension,['Name','University','totalExp'],'Name');
  d3.select('#download')
    .on('click', function() {
      let data = totalExpChart.chartDimension.top(Infinity);
      data = data.sort(function(a, b) {
        return table.order()(table.sortBy()(a), table.sortBy()(b));
      });
      data = data.map(function(d) {
        let row = {};
        table.columns().forEach(function(c) {
          console.log('c',c);
          row[table._doColumnHeaderFormat(c)] = table._doColumnValueFormat(c, d);
        });
        return row;
      });
      console.log('data ',data);
      let xls = json2xls(data);
      ipc.send('exportdata',xls)
      // let blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
      // saveAs(blob, 'data.csv');
    });
});
ipc.on('saved-file', function (event, file) {
  if (!file.filename) console('No path');
  fs.writeFileSync(file.filename, file.xls, 'binary');
  alert('File Successfully saved !');
  console.log('ok',file);
});