/**
 * Created by Rohail on 6/17/2017.
 */


const d3 = require("d3");
const dc = require('dc');

let dimensions = {};
let graphs = {};
let groups = {};

let ndx = null;


const initializeCrossFilter = (data) => {
  ndx = crossfilter(data);
  return ndx;
};

const initializePieChart = (id,dimension) => {
  let pieChart  = dc.pieChart("#"+id);
  let chartDimension = ndx.dimension(function(d) { return d[dimension]});
  let group = chartDimension.group().reduceCount(function(d) {return d[dimension];});
  pieChart
    .width(768)
    .height(480)
    .slicesCap(20)
    .innerRadius(50)
    .dimension(chartDimension)
    .group(group)
    .legend(dc.legend())
    // workaround for #703: not enough data is accessible through .label() to display percentages
    .on('pretransition', function(chart) {
      chart.selectAll('text.pie-slice').text(function(d) {
        return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
      })
    });

  dc.renderAll();
  return {
    pieChart,
    chartDimension,
    group
  };
};


const initializeTable = (id,dimension,columns,sortBy) => {
  let table = dc.dataTable('#'+id);
  // let columnsArrays = columns  // ['Name','dob','University','totalExp'];
  table
    .dimension(dimension)
    .group(function(d) {
      return d.value;
    })
    .sortBy(function(d) { return d[sortBy]; })
    .showGroups(false)
    .size(Infinity)
    .columns(columns)
    .order(d3.ascending);
  dc.renderAll();
  return table;
};

module.exports = {
  addGraph,
  initializeCrossFilter,
  initializePieChart,
  initializeTable
};


function addGraph(id){
  // block div
  let div = document.createElement("div");
  div.className   = "barChartGraph";

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
  let h1 = document.createElement("h1");
  h1.innerHTML = (id.split('_')[1] ? id.split('_')[1] : id)  + " Skill Level"
  div.appendChild(h1);
  div.appendChild(graphdiv);
  // container dive :D
  document.getElementById("container").insertBefore(div,document.getElementById("totalExpContainer"));
  CreateGraph(id);
  achor.href = "javascript:graphs['"+id+"'].filterAll();dc.redrawAll();"
  return graphs;
}

function CreateGraph(id){
  graphs[id] = dc.barChart('#'+id+"Graph");
  dimensions[id] = ndx.dimension(function(d) { return d[id]; });
  groups[id] = dimensions[id].group().reduceCount(function (d) {return d[id];});
  graphs[id].width(500)
    .height(380)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .xAxisLabel('skill Level')
    .yAxisLabel('No of Professionals')
    .dimension(dimensions[id])
    .barPadding(0.1)
    .outerPadding(0.05)
    .group(groups[id]);
  graphs[id].render();

  let dynamicColumns = [];
  for(let props in graphs){

    let obj = {
      label : (props.split('_')[1] ? props.split('_')[1] : props)   + " Skill ",
      format: function(d) {
        return d[props];
      }
    };
    dynamicColumns.push(obj);
  }
  let columnsArrays = ['Name','dob','University','totalExp',...dynamicColumns]
  let table = dc.dataTable('#table');
  table
    .dimension(dimensions[id])
    .group(function(d) {
      return d.value;
    })
    .sortBy(function(d) { return d.Name; })
    .showGroups(false)
    .size(Infinity)
    .columns(columnsArrays)
    .order(d3.ascending);

  table.render();

}