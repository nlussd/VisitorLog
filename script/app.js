require([
    "script/face.js",
    "esri/request",
    "dojo/_base/json",
    "dojo/dom",
    "dojo/domReady!"
], 
function(SpatialReference, esriRequest, dojoJson) 
{ 

    $("#post").click(function(){

        var objPt = [{ "attributes": { "f1": "Front Office", "f2": gender, "f3" :age, "f4" : smile }, "geometry": {"x":11889970.713866549, "y":-701701.1229169335} }];
       
        var visitorPt = JSON.stringify(objPt);
       
        var layersRequest = esriRequest({
            url: "https://services8.arcgis.com/mpSDBlkEzjS62WgX/ArcGIS/rest/services/aLFYn/FeatureServer/0/addFeatures",                         
           content: {
               "features": visitorPt,
               "f": "json"}}, {"usePost": true});

        layersRequest.then(console.log('success'), console.log('error'));

    });



});