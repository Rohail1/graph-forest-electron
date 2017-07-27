/**
 * Created by Rohail on 6/17/2017.
 */


const d3 = require("d3");
const dc = require('dc');

let dimensions = {};
let graphs = {};
let groups = {};
let table = null;
let ndx = null;


const initializeCrossFilter = (data) => {
  ndx = crossfilter(data);
  return ndx;
};

const initializeDimension = (key) => {
  return ndx.dimension(function(d) { return d[key]})
};

const initializePieChart = (id,dimension) => {
  let pieChart  = dc.pieChart("#"+id);
  let chartDimension = ndx.dimension(function(d) { return d[dimension]});
  let group = chartDimension.group().reduceCount(function(d) {return d[dimension];});
  pieChart
    .width(600)
    .height(480)
    .slicesCap(20)
    .innerRadius(60)
    .dimension(chartDimension)
    .group(group)
    .legend(dc.legend());

  dc.renderAll();
  return {
    pieChart,
    chartDimension,
    group
  };
};

const initializeTable = (id,dimension,columns,sortBy,filter = null) => {
  table = dc.dataTable('#'+id);
  table
    .dimension(dimension)
    .group(function(d) {
      return d.value;
    })
    .filter(filter)
    .sortBy(function(d) { return d[sortBy]; })
    .showGroups(false)
    .size(Infinity)
    .columns(columns)
    .order(d3.ascending);
  dc.renderAll();
  return table;
};

const addGraph = (key,id) =>{
  // block div
  if(graphs[id])
    return graphs;
  let div = document.createElement("div");
  let row = document.createElement("div");
  let column = document.createElement("div");
  div.className   = "barChartGraph";
  column.className   = "col-lg-4";
  row.className   = "row";
  row.appendChild(column);
  // graph div
  let graphdiv = document.createElement("div");
  graphdiv.id  = id+'Graph';

  // reset div
  let resetDiv = document.createElement("div");
  resetDiv.className   = "reset";
  resetDiv.innerHTML= "selected : ";

  //span and achortag
  let span = document.createElement("span");
  span.className = "filter";
  let achor = document.createElement("a");
  achor.innerHTML = " reset";
  resetDiv.appendChild(span);
  resetDiv.appendChild(achor);
  graphdiv.appendChild(resetDiv);

  // heading
  let h4 = document.createElement("h4");
  h4.innerHTML = (key.split('_')[1] ? key.split('_')[1] : key)  + " Skill";
  div.appendChild(h4);
  div.appendChild(graphdiv);
  // container dive :D
  column.appendChild(div);
  // document.getElementById("container").insertBefore(row,document.getElementById('tableRow'));
  document.getElementById("graphContainer").appendChild(column);
  let table  = CreateGraph(key,id);
  achor.href = "javascript:graphs['"+id+"'].filterAll();dc.redrawAll();";
  return {graphs,table};
};

const CreateGraph = (key,id) =>{
  graphs[id] = dc.barChart('#'+id+"Graph");
  dimensions[id] = ndx.dimension(function(d) { return d[key]; });
  groups[id] = dimensions[id].group().reduceCount(function (d) {return d[key];});
  graphs[id].width(400)
    .height(380)
    .x(d3.scale.ordinal())
    .y(d3.scale.linear().domain([0,ndx.size()]))
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .xAxisLabel('skill Level')
    .yAxisLabel('No of Professionals')
    .dimension(dimensions[id])
    .barPadding(0.1)
    .outerPadding(0.05)
    .group(groups[id]);
  graphs[id].render();

  let dynamicColumns = table.columns();
  if(!dynamicColumns.includes(key)) dynamicColumns.push(key);
  table
    .dimension(dimensions[id])
    .group(function(d) {
      return d.value;
    })
    .sortBy(function(d) { return d.Name; })
    .showGroups(false)
    .size(Infinity)
    .columns(dynamicColumns)
    .order(d3.ascending);

  table.render();
  return table;
};

module.exports = {
  addGraph,
  initializeCrossFilter,
  initializeDimension,
  initializePieChart,
  initializeTable,
};
