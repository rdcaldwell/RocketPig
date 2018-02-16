const GRAPH = require('node-all-paths');
const ROUTE = new GRAPH();

/*
var flight1 = {
    departure: "DFW",
    arrival: "RSW",
    distance: 989
}

var flight2 = {
    departure: "DFW",
    arrival: "NYC",
    distance: 1370
}

var flight3 = {
    departure: "RSW",
    arrival: "NYC",
    distance: 1071
}

ROUTE.addNode('RSW', )*/

ROUTE.addNode('DFW', { RSW:989, NYC: 1370 });
ROUTE.addNode('RSW', { DFW: 989, NYC:1071 });
ROUTE.addNode('NYC', { DFW: 1370, RSW:1071, MIA:1092 });
ROUTE.addNode('MIA', { NYC: 1092 })

console.log(ROUTE.path('RSW', 'MIA'));
