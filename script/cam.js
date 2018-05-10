var imS, blob;

(function () {
  'use strict';
  var video = document.querySelector('video')
    , canvas;

  /**
   *  generates a still frame image from the stream in the <video>
   *  appends the image to the <body>
   */
  function takeSnapshot() {
    var img = document.querySelector('img') || document.createElement('img');
    var context;
    var width = video.offsetWidth
      , height = video.offsetHeight;

    canvas = canvas || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    img.src = canvas.toDataURL('binary/bin');
    imS = canvas.toDataURL('binary/bin');
    pic.appendChild(img);

    //**dataURL to blob**
    function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }

    blob = dataURLtoBlob(imS);

  }

  // use MediaDevices API
  // docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if (navigator.mediaDevices) {
    // access the web cam
    navigator.mediaDevices.getUserMedia({ video: true })
      // permission granted:
      .then(function (stream) {
        video.src = window.URL.createObjectURL(stream);
        // click button and take photo
        $("#snap").click(takeSnapshot);
        $("#process").prop('disabled', false);
      })
      // permission denied:
      .catch(function (error) {
        document.body.textContent = 'Could not access the camera. Error: ' + error.name;
      });
  }
})();
