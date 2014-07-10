if (typeof urlextract === 'undefined'){
	var urlextract = {
		confr: document.getElementById('URIExtractorIFrame'),
		init: function(){
			if (urlextract.confr == null){
				urlextract.confr = document.createElement('IFRAME');
				urlextract.confr.setAttribute('id','URIExtractorIFrame');
				urlextract.confr.scrolling = 'no';
				urlextract.confr.style.cssText =
				'border:none;position:fixed;top:0;left:0;z-index:99999;box-sizing:border-box;width:100%;border-bottom:solid 1px #000;box-shadow:0 2px 4px rgba(0,0,0,.3);overflow:hidden;';
				document.body.appendChild(urlextract.confr);
				var doc = urlextract.confr.contentWindow.document;
				doc.open();
				doc.write('<!DOCTYPE html><head>'
					+ '<style>'
					+ 'html,body{height:100%;margin:0} body{padding:0 .5rem;line-height:1.2rem;color:#fff;background-color:rgba(0,0,0,.75);} div{width:100%} .textBox{display:block;box-sizing:border-box;width:100%;border:solid 1px #999;background:transparent;color:inherit;padding:0 .5rem} .output{height:80px;resize:vertical;overflow-y:scroll}'
					+ '</style>'
					+ '</head>'
					+ '<body>'
					+ '<div>'
					+ '<span>URLPathToFind:</span><input class="textBox" id="ConsoleInput" type="text">'
					+ '</div>'
					+ '<div>'
					+ '<span>Results:</span>'
					+ '<textarea class="textBox output" id="ConsoleOutput">'
					+ '</textarea>'
					+ '</div>'
					+ '</body></html>');
				doc.close();
				collectAnchors(urlextract.confr);
			}
		},
		toggle: function(){
			urlextract.confr.style.display = "none" == urlextract.confr.style.display ? "" : "none";
		}
	}
} else {
	urlextract.toggle();
}

function collectAnchors(confr){
var anchors = document.getElementsByTagName('a');
var iframes = document.getElementsByTagName('iframe');
if (iframes){
	for (var key in iframes){
		if( /*@cc_on ! @*/ false ){
			iframes[key].onreadystatechange = function(){
				if( window.event.srcElement.readyState == "complete" ){
					collectAnchorsOfIframe(iframes[key], anchors);
				}
			}
		}
		else{
			iframes[key].onload = collectAnchorsOfIframe(iframes[key], anchors);
		}
	}
}

var condoc = confr.contentDocument || confr.contentWindow.document;
var ein = condoc.getElementById('ConsoleInput');
ein.value = window.location.host + window.location.pathname;
ein.addEventListener('input',function(e){condoc.getElementById('ConsoleOutput').value = uriMatching(anchors, this.value);}, false);
condoc.getElementById('ConsoleOutput').value = uriMatching(anchors, ein.value);
}

function uriMatching(anchors, strURLPrefix){
	var strURI = '';
	var objURIs = {};
	var arryResult = [];
	for (var key in anchors){
		if(anchors[key].href){
		strURI = anchors[key].href;
			if (strURI.indexOf(strURLPrefix) !== -1){
				objURIs[strURI] = '';
			}
		}
	}
	for (var key in objURIs){
		arryResult.push(key.toString());
	}
	return arryResult.join('\n');
}


function collectAnchorsOfIframe(iframe, anchors){
	try{
		var doc = iframe.contentDocument || iframe.contentWindow.document;
        var frameAnchors = doc.getElementsByTagName('a');
        for (var key in frameAnchors) {
                anchors[iframe.src + key] = frameAnchors[key];
        }
	}
	catch(e){
		console.log(e);
	}
}
