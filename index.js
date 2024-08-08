
  var unityInstanceRef;
  var unsubscribe;
  var container = document.querySelector("#unity-container");
  var canvas = document.querySelector("#unity-canvas");
  var loadingBar = document.querySelector("#unity-loading-bar");
  var progressBarFull = document.querySelector("#unity-progress-bar-full");
  var warningBanner = document.querySelector("#unity-warning");

  // Shows a temporary message banner/ribbon for a few seconds, or
  // a permanent error message on top of the canvas if type=='error'.
  // If type=='warning', a yellow highlight color is used.
  // Modify or remove this function to customize the visually presented
  // way that non-critical warnings and error messages are presented to the
  // user.
  function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
      warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
      if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
      setTimeout(function() {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }
    updateBannerVisibility();
  }

  var buildUrl = "Build";
  var loaderUrl = buildUrl + "/WebGL.loader.js";
  var config = {
    dataUrl: buildUrl + "/WebGL.data.unityweb",
    frameworkUrl: buildUrl + "/WebGL.framework.js.unityweb",
    codeUrl: buildUrl + "/WebGL.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "CatB",
    productName: "Cat Battle",
    productVersion: "1.0.88",
    showBanner: unityShowBanner,
	cacheControl: function (url) {
  //return "immutable";
     return "no-store";
   },
  };

  // By default Unity keeps WebGL canvas render target size matched with
  // the DOM size of the canvas element (scaled by window.devicePixelRatio)
  // Set this to false if you want to decouple this synchronization from
  // happening inside the engine, and you would instead like to size up
  // the canvas DOM size and WebGL render target sizes yourself.
  // config.matchWebGLToCanvasSize = false;

  render();

  canvas.style.background = "url('" + buildUrl + "/WebGL.jpg') center / cover";
  loadingBar.style.display = "block";

  var script = document.createElement("script");
  script.src = loaderUrl;
  script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
      //progressBarFull.style.width = 100 * progress + "%";
	  setPercentage(100 * progress);
    }).then((unityInstance) => {
      unityInstanceRef = unityInstance;
      loadingBar.style.display = "none";
    }).catch((message) => {
      alert(message);
    });
  };
  document.body.appendChild(script);
  
  // Resize
  function render() {
	  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
		// Mobile device style: fill the whole browser client area with the game canvas:
		var meta = document.createElement('meta');
		meta.name = 'viewport';
		meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
		document.getElementsByTagName('head')[0].appendChild(meta);
	  }
	  else{
		var ratio = 1080/2160;

		canvas.style.width  = window.innerHeight * ratio + "px";
		canvas.style.height = "100%";

		canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		canvas.width = canvas.height * ratio;
		canvas.style.position = "fixed";
		canvas.style.left = ((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) / 2 - canvas.width / 2) + "px";
	  }
	};
		
	function resizeCanvas() {
	  var width = canvas.clientWidth;
	  var height = canvas.clientHeight;
	  if (canvas.width != width ||
		  canvas.height != height) {
		canvas.width = width;
		canvas.height = height;
			  
		// in this case just render when the window is resized.
		render();
	  }
	}

	window.addEventListener('resize', resizeCanvas);


const progressContainer = document.querySelector('.progress-container');

function setPercentage(pecent) {
  const percentage = pecent
  + '%';
  
  const progressEl = progressContainer.querySelector('.progress');
  //const percentageEl = progressContainer.querySelector('.percentage');
  
  progressEl.style.width = percentage;
  //percentageEl.innerText = percentage;
  //percentageEl.style.left = percentage;
}


// Caching control
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('ServiceWorker.js')
        .then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);

            registration.addEventListener('updatefound', function() {
                const newWorker = registration.installing;

                newWorker.addEventListener('statechange', function() {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // New content is available, inform the user
                            notifyUserAboutUpdate();
							//console.log('ServiceWorker Update!!!');
							//ForceReload();
                        }
                    }
                });
            });
        }).catch(function(error) {
            console.log('ServiceWorker registration failed: ', error);
        });

    // Listening for messages from the Service Worker
    navigator.serviceWorker.addEventListener('message', function(event) {
        if (event.data === 'newVersionAvailable') {
            notifyUserAboutUpdate();
			//console.log('ServiceWorker Update 1!!!');
			//ForceReload();
        }
    });
}

function notifyUserAboutUpdate() {
    alertAndForceUserAboutUpdate();
}

function notifyUserAboutUpdateByClickButton() {
	// Show a custom update message to the user
    const updateMessage = document.createElement('div');
    
    //updateMessage.innerText = 'New version available. Click to update!';
    updateMessage.style.position = 'fixed';
    updateMessage.style.bottom = '0';
    updateMessage.style.width = '100%';
    updateMessage.style.height = '100%';
    updateMessage.style.backgroundColor = 'transparent';
    updateMessage.style.textAlign = 'center';
    //updateMessage.style.color = '#FFFFFF';
    updateMessage.style.fontSize = '23px';
    updateMessage.style.padding = '10px';
    updateMessage.style.zIndex = '1000';
	document.body.appendChild(updateMessage);
	
	const popMessage = document.createElement('div');
	popMessage.innerText = 'New version available. Click to update!';
    popMessage.style.position = 'fixed';
    popMessage.style.bottom = '0';
    popMessage.style.width = '100%';
    popMessage.style.backgroundColor = '#29f051';
    popMessage.style.textAlign = 'center';
    popMessage.style.color = '#FFFFFF';
    popMessage.style.fontSize = '20px';
    popMessage.style.padding = '10px';
    popMessage.style.zIndex = '1000';
	
	updateMessage.appendChild(popMessage);
	
    

    updateMessage.addEventListener('click', () => {
        ForceReload();
      //alert('The application has been updated. Please clear your browser cache to ensure you have the latest version.');
    });
	
}

function alertAndForceUserAboutUpdate() {
	alert("New version available. Press OK to update!");
    ForceReload();
	
}

function ForceReload()
{
	//console.log('ServiceWorker Update 2!!!');
	if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage('skipWaiting');
        }
		
		window.location.reload();
		//alert('The application has been updated. Please clear your browser cache to ensure you have the latest version.');
}
