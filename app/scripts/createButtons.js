/**
 * Created by Rohail on 6/17/2017.
 */


module.exports = function (data,parentElement) {
  let graphs = [];
  Object.keys(data.reduce(function (a, b) { return Object.keys(a).length > Object.keys(b).length ? a : b; }))
    .forEach(props =>{

      function eventMethod () {
        graphs = require('../scripts/initGraphs').addGraph(props)
      }

      let button = document.createElement("button");
      button.id = props;
      button.innerHTML = props;
      button.className   = "btn btn-primary paddingClass";
      button.onclick = eventMethod;  //require('../scripts/initGraphs').addGraph;
      parentElement.appendChild(button);
    });
    return graphs;
  // /**/<button id="<%- prop %>" onclick="addGraph('<%- prop %>')" class="btn btn-primary paddingClass" >

};