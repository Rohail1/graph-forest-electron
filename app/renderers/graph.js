/**
 * Created by Rohail on 6/17/2017.
 */


const ipc = require('electron').ipcRenderer;
const crossFilterClass = require('../scripts/initGraphs');
let totalExpChart;
let vdExpChart;
let table;
ipc.on('graphData', function (event,data) {
  crossFilterClass.initializeCrossFilter(data);
  totalExpChart = crossFilterClass.initializePieChart('totalExpPie','totalExp');
  vdExpChart = crossFilterClass.initializePieChart('VdExpPie','totalVdExp');
  table = crossFilterClass.initializeTable('table',totalExpChart.chartDimension,['Name','dob','University','totalExp'],'Name');

});