require([
    "script/cam.js",
    "esri/request",
    "dojo/_base/json",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"
],
    function (SpatialReference, esriRequest, dojoJson, on, dom) {


        var gender, age, smile, word;
        var resurl;


        // make esri request to send data through arcgis rest & webhooks
        function sendData() {

            var objPt = [{ "attributes": { "f1": "Front Office", "f2": gender, "f3": age, "f4": smile }, "geometry": { "x": 11889970.713866549, "y": -701701.1229169335 } }];

            var visitorPt = JSON.stringify(objPt);

            var layersRequest = esriRequest({
                url: "https://services8.arcgis.com/mpSDBlkEzjS62WgX/ArcGIS/rest/services/aLFYn/FeatureServer/0/addFeatures",
                content: {
                    "features": visitorPt,
                    "f": "json"
                }
            }, { "usePost": true });

            layersRequest.then(console.log('success'), console.log('error'));


            // set up post request for webhook
            var hookUrl = 'https://hook.integromat.com/gwnk7954kpgj7asnm0ggqcvt4ihz186h';
            var http = new XMLHttpRequest();
            http.open('POST', hookUrl, true);
            http.setRequestHeader('Content-Type', 'application/json');
            

             http.onreadystatechange = function (e) {
                if (http.readyState == 4 && http.status == 200) {
                    alert(http.responseText);
                }
            }

            http.send(visitorPt);



        };


        // setting for Cloudinary
        //change with your cloudinary cloudname
        const cloudName = '';
        const unsignedUploadPreset = 'jlshuxbp';


        // Upload to Cloudinary
        function uploadFile(file) {
            var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            xhr.onreadystatechange = function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // File uploaded successfully
                    var response = JSON.parse(xhr.responseText);
                    // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
                    resurl = response.secure_url;

                    // execute sending data through Face API
                    processImage();
                }
            };

            fd.append('upload_preset', unsignedUploadPreset);
            fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
            fd.append('file', file);
            xhr.send(fd);
        }

        function processImage() {
            // **********************************************
            // *** Update or verify the following values. ***
            // **********************************************

            // Replace the subscriptionKey string value with your valid subscription key.
            var subscriptionKey = "";

            // use the url given by azure in Face API (may differ based on subscription)
            var uriBase = "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect";

            // Request parameters.
            var params = {
                "returnFaceId": "true",
                "returnFaceLandmarks": "false",
                "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
            };

            // Perform the REST API call.
            $.ajax({
                url: uriBase + "?" + $.param(params),

                // Request headers.
                beforeSend: function (xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                },

                type: "POST",

                // Request body.
                data: '{"url": ' + '"' + resurl + '"}',

            })

                .done(function (data) {

                    // store data into variables
                    gender = data["0"].faceAttributes.gender;
                    age = data["0"].faceAttributes.age;
                    smile = data["0"].faceAttributes.smile;

                    // make some logic for words based on smile index
                    if (smile > 0.5) {
                        word = "You look happy today!";
                    } else {
                        word = "May you have a nice day today!"
                    }

                    // put result text in html div
                    $("#result").html('<div> Your gender is ' + gender + ', age ' + age + '. <br>' + word + '<br>We hope you look younger than you actually are :) </div>');

                    $("#post").prop('disabled', false);


                    // execute to send data via ArcGIS Rest
                    sendData();

                    
                })

                .fail(function (jqXHR, textStatus, errorThrown) {
                    // Display error message.
                    var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                    errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                        jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                    alert(errorString);
                });
        };

        $('#process').click(function(){
            uploadFile(blob);
            
        });

    });
