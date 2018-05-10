var gender, age, smile, word;
var resurl;


const cloudName = 'lusi0504';
const unsignedUploadPreset = 'jlshuxbp';



// *********** Upload file to Cloudinary ******************** //
function uploadFile(file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText);
        // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
        resurl = response.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        var tokens = resurl.split('/');
        tokens.splice(-2, 0, 'w_150,c_scale');
        var img = new Image(); // HTML5 Constructor
        img.src = tokens.join('/');
        img.alt = response.public_id;
        // document.getElementById('gallery').appendChild(img);
        console.log(resurl);
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
    var subscriptionKey = "13ba648535fa4508af4553f9327e1f95";

    // Replace or verify the region.
    //
    // You must use the same region in your REST API call as you used to obtain your subscription keys.
    // For example, if you obtained your subscription keys from the westus region, replace
    // "westcentralus" in the URI below with "westus".
    //
    // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
    // a free trial subscription key, you should not need to change this region.
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
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",
        
        // Request body.
        data: '{"url": ' + '"' + resurl + '"}',
 
    })

    .done(function(data) {

        // store data into variables
        gender = data["0"].faceAttributes.gender;
        age = data["0"].faceAttributes.age;
        smile = data["0"].faceAttributes.smile;


        if (smile > 0.5) {
            word = "You look happy today!";
        } else {
            word = "May you have a nice day today!"
        }

        $("#result").html('<div> Your gender is ' + gender + ', age ' + age + '. <br>' + word + '<br>We hope you look younger than you actually are :) </div>');
       
        $("#post").prop('disabled', false);
  
        
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
};