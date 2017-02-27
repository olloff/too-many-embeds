// ==UserScript==
// @name Too Many Embeds
// @namespace https://greasyfork.org/en/scripts/10233-too-many-embeds
// @author Steve5451, dargereldren, olloff
// @version 1.2.1
// @description Embed links from various sites.
// @icon http://i.imgur.com/clxI85t.png
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @include     file*
// ==/UserScript==

/* Original here: http://thepotato.net/blocklandembedder.user.js */

var imageExt = [ 'jpg', 'jpeg', 'gif', 'png', 'webp', 'bmp' ];
var videoExt = [ 'mp4', 'webm', 'ogv' ];
var audioExt = [ 'mp3', 'ogg', 'wav' ];

function parseLink (url) {
	var result = {};
	var hashquery = url.split('#');
	var query = hashquery[0].split('?');
	var path = query[0].split('/');
	var domains = path[2].split('.');
	path.splice(0,3);
	if (query[0].split('/').reverse()[0] == '') {
		path.pop();
	}
	if (domains[0] == 'www') {
		domains.splice(0,1);
	}

	result.domains = domains.reverse();
	result.path = path;
	result.query = query[1];
	result.hashquery = hashquery[1];
	return result;
}

$('a[href*="youtu.be/"]').each(function() {
	var hashquery = parseLink($(this).attr('href')).hashquery;
	var query = parseLink($(this).attr('href')).query;
	var vidId = query[0].match('(?:youtu\.be\/)([a-zA-Z0-9_-]{11})');
	if (query[1]!=null) {
		query = query[1].split('&');
		if (hashquery[1]!=null) {
			query.push(hashquery[1]);
		}
	}
	var params = "";
	var time = [];

	if (query.length>0) {
		for(var i=0; i<query.length; i++) {
			if (time == null || time.length < 2 || time[0]==0) {
				time = query[i].match('start=([\\dhms]+)') || query[i].match('t=([\\dhms]+)') || query[i].match('time_continue=([\\dhms]+)') || [0,0];
			}
		}
		time = "start=" + time[1];
		params = time;
	}

	//console.log(hashquery,query,vidId,params);
	embedMedia(vidId[1], $(this), 'youtubeExpand', params);
});


$('a[href*="youtube.com/v/"]').each(function() {
	var hashquery = parseLink($(this).attr('href')).hashquery;
	var query = parseLink($(this).attr('href')).query;
	var vidId = query[0].match('(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})');
	if (query[1]!=null) {
		query = query[1].split('&');
		if (hashquery[1]!=null) {
			query.push(hashquery[1]);
		}
	}
	var params = "";
	var time = [];

	if (query.length>0) {
		for(var i=0; i<query.length; i++) {
			if (time == null || time.length < 2 || time[0]==0) {
				time = query[i].match('start=([\\dhms]+)') || query[i].match('t=([\\dhms]+)') || query[i].match('time_continue=([\\dhms]+)') || [0,0];
			}
		}
		time = "start=" + time[1];
		params = time;
	}

	//console.log(hashquery,query,vidId,params);
	embedMedia(vidId[1], $(this), 'youtubeExpand', params);
});

$('a[href*="youtube.com/watch"]').each(function() {
	var hashquery = parseLink($(this).attr('href')).hashquery;
	var query = parseLink($(this).attr('href')).query;
	var vidId = [];
	if (query[1]!=null) {
		query = query[1].split('&');
		if (hashquery[1]!=null) {
			query.push(hashquery[1]);
		}
	}
	var params = "";
	var time = [];

	if (query.length>0) {
		for(var i=0; i<query.length; i++) {
			if (vidId == null || vidId.length < 2) {
				vidId = query[i].match('v=([a-zA-Z0-9_-]{11})');
			}
			if (time == null || time.length < 2 || time[0]==0) {
				time = query[i].match('start=([\\dhms]+)') || query[i].match('t=([\\dhms]+)') || query[i].match('time_continue=([\\dhms]+)') || [0,0];
			}
		}
		time = "start=" + time[1];
		params = time;
	}
	//console.log(hashquery,query,vidId,time,params);
	embedMedia(vidId[1], $(this), 'youtubeExpand', params);
});

$('a[href*="soundcloud.com/"]').each(function() {
	var scId = $(this).attr('href');
	scId.replace(' ', '');
	embedMedia(scId, $(this), 'soundcloudExpand');
});

$('a[href*="vocaroo.com/i/"]').each(function() {
	var vocId = $(this).attr('href').split('/i/')[1];
	embedMedia(vocId, $(this), 'vocarooExpand');
});

$('a[href*="imgur.com/"]').each(function() {
	var imgurId = {};
	imgurId = $(this).attr('href').split('imgur.com/');
	if (imgurId.length == 2) {
		if (imgurId[0].match('https?\:\/\/i\.') == null) {
			if (imgurId[1].match('^a\/') != null) {
				imgurId = imgurId[1].match('(a\/[a-zA-Z0-9]{5})');
				//console.log($(this).attr('href'),imgurId);
			} else if (imgurId[1].match('^gallery\/') != null) {
				imgurId = imgurId[1].match('\/([a-zA-Z0-9]{5,7})$');
				//console.log($(this).attr('href'),imgurId);
			} else if (imgurId[1].match('^r\/') != null) {
				imgurId = imgurId[1].match('\/([a-zA-Z0-9]{7})$');
				//console.log($(this).attr('href'),imgurId);
			} else {
				imgurId = imgurId[1].match('([a-zA-Z0-9]{7})');
				//console.log($(this).attr('href'),imgurId);
			}
			embedMedia(imgurId[1], $(this), 'imgurExpand');
		} else {
			imgurId = imgurId[1].match('([a-zA-Z0-9]{7})\.');
			embedMedia(imgurId[1], $(this), 'imgurExpand');
		}
	}
});

$('a[href*="giphy.com/"]').each(function() {
	var giphyId;
	var path = parseLink($(this).attr('href')).path;
	if (path[0] == 'gifs' && path[path.length-1].split('-').length > 1) {
		giphyId = path[path.length-1].split('-').reverse()[0];
		console.log($(this).attr('href'),'1',path.join('/'));
		embedMedia(giphyId, $(this), 'giphyExpand');
	} else if (path[0] == 'gifs') {
		giphyId = path[1];
		console.log($(this).attr('href'),'2',path.join('/'));
		embedMedia(giphyId, $(this), 'giphyExpand');
	} else if (path[0] == 'media') {
		giphyId = path[path.length-2];
		console.log($(this).attr('href'),'3',path.join('/'));
		embedMedia(giphyId, $(this), 'giphyExpand');
	}
});

$('a[href*="googleusercontent.com/"]').each(function() {
	var imagePath = 'https://lh3.googleusercontent.com/' + parseLink($(this).attr('href')).path.join('/');
	embedMedia(imagePath, $(this), 'imageExpand');
});

$('a[href*="dropbox.com/"]').each(function() {
	var objectPath = 'https://dl.dropboxusercontent.com/' + parseLink($(this).attr('href')).path.join('/');
	if ($.inArray(parseLink($(this).attr('href')).path.split('.')[1], imageExt) > 0) {
		embedMedia(objectPath, $(this), 'imageExpand');
	} else if ($.inArray(parseLink($(this).attr('href')).path.split('.')[1], videoExt) > 0) {
		embedMedia(objectPath, $(this), 'videoExpand');
	} else if ($.inArray(parseLink($(this).attr('href')).path.split('.')[1], audioExt) > 0) {
		embedMedia(objectPath, $(this), 'videoExpand');
	}
});

$('a[href*="twitter.com/"]').each(function() {
	var twitterPath = parseLink($(this).attr('href')).path.join('/');
	embedMedia(twitterPath, $(this), 'twitterExpand');
});

$('a[href*="streamable.com/"]').each(function() {
	var streamableId = parseLink($(this).attr('href')).path.join('/');
	embedMedia(streamableId, $(this), 'streamableExpand');
});

$('a[href*="gfycat.com/"]').each(function() {
	var gfycatId = parseLink($(this).attr('href')).path.join('/');
	embedMedia(gfycatId, $(this), 'gfycatExpand');
});

$('a[href*="instagram.com/"]').each(function() {
	var instagramId = parseLink($(this).attr('href')).path.reverse()[0];
	embedMedia(instagramId, $(this), 'instagramExpand');
});

$('a[href*="coub.com/"]').each(function() {
	var coubId = parseLink($(this).attr('href')).path.reverse()[0];
	embedMedia(coubId, $(this), 'coubExpand');
});

$('a[href$=".swf"],a[href*=".swf?"]').each(function() {
	var flashId = $(this).attr('href');
	embedMedia(flashId, $(this), 'flashExpand');
});

$('a[href$=".png"],a[href$=".jpg"],a[href$=".gif"],a[href*=".png?"],a[href*=".jpg?"],a[href*=".gif?"]').each(function() {
	var imageId = $(this).attr('href');
	var domains = parseLink($(this).attr('href')).domains;
	//console.log(domains[1]+domains[0]);

	if(domains[1]+domains[0] == 'mediafirecom') {
		return;
	} else if(domains[1]+domains[0] == 'dropboxcom') {
		return;
	} else if(domains[1]+domains[0] == 'googleusercontentcom') {
		return;
	} else if(domains[1]+domains[0] == 'imgurcom') {
		return;
	} else if(domains[1]+domains[0] == 'giphycom') {
		return;
	}

	embedMedia(imageId, $(this), 'imageExpand');
});

$('a[href$=".mp3"],a[href$=".ogg"],a[href$=".wav"],a[href*=".mp3?"],a[href*=".ogg?"],a[href*=".wav?"]').each(function() {
	var audioId = $(this).attr('href');
	if($(this).is('[href*="www.dropbox.com"]')) {
		audioId = audioId.replace("www.dropbox.com","dl.dropboxusercontent.com");
	} else if($(this).is('[href*="mediafire.com"]')) {
		return;
	}
	embedMedia(audioId, $(this), 'audioExpand');
});

$('a[href$=".mp4"],a[href$=".webm"],a[href$=".ogv"],a[href*=".mp4?"],a[href*=".webm?"],a[href*=".ogv?"]').each(function() {
	var videoId = $(this).attr('href');
	if($(this).is('[href*="www.dropbox.com"]')) {
		videoId = videoId.replace("www.dropbox.com","dl.dropboxusercontent.com");
	} else if($(this).is('[href*="mediafire.com"]')) {
		return;
	}
	embedMedia(videoId, $(this), 'videoExpand');
});

$('a[href*="store.steampowered.com/app/"]').each(function() {
	var steamId = $(this).attr('href').split('store.steampowered.com/app/')[1];
	embedMedia(steamId, $(this), 'steamExpand');
});

$('a[href*="beepbox.co/#"]').each(function() {
	var beepboxId = $(this).attr('href').split('#')[1];
	embedMedia(beepboxId, $(this), 'beepboxExpand');
});

$('a[href*="dailymotion.com/video/"]').each(function() {
	var vidId = $(this).attr('href').split('/video/')[1];
	vidId = vidId.split('_')[0];
	embedMedia(vidId, $(this), 'dailymotionExpand');
});

$('a[href*="vimeo.com/"]').each(function() {
	var vidId = $(this).attr('href').split('/');
	vidId = vidId[vidId.length - 1];
	embedMedia(vidId, $(this), 'vimeoExpand');
});

$('a[href*="pastebin.com/"]').each(function() {
	var pasteId = $(this).attr('href').split('/');
	pasteId = pasteId[pasteId.length - 1];
	pasteId = pasteId.replace("raw.php?i=", '');
	embedMedia(pasteId, $(this), 'pastebinExpand');
});

$('a[href*="p3d.in/"]').each(function() {
	var p3dId = $(this).attr('href').split('/');
	p3dId = p3dId[p3dId.length - 1];
	embedMedia(p3dId, $(this), 'p3dExpand');
});

$('a[href*="drive.google.com/file/d/"]').each(function() {
	var driveId = $(this).attr('href').split('/file/d/')[1];
	driveId = driveId.split('/')[0];
	embedMedia(driveId, $(this), 'googleDriveExpand');
});

$('a[href*="drive.google.com/uc"]').each(function() {
	var driveId = $(this).attr('href').split('id=')[1];
	driveId = driveId.split('&')[0];
	embedMedia(driveId, $(this), 'googleDriveExpand');
});


$('a[href*="fav.me/"],a[href*="deviantart.com/art/"],' +
	'a[href*=".tumblr.com/post/"],' +
	'a[href*=".bandcamp.com/album/"],a[href*=".bandcamp.com/track/"]').each(function() {
	var vidId = $(this).attr('href');
	embedMedia(vidId, $(this), 'embedlyExpand');
});

function embedMedia(medId, thisItem, embedType, params) {
	thisItem.after(' <a href="javascript:void(0);" class="embedMedia" id="' + embedType + '" expanded="false" params="' + params + '" medId="' + medId + '">&#10133;</a> ');
}

$(document).find(".embedMedia").click(function() {
	if ($(this).attr('expanded') == "false") {
		var thisId = $(this).attr('id');
		if (thisId == 'youtubeExpand') {
			$(this).after('<div><iframe width="640" height="360" src="https://www.youtube.com/embed/' + $(this).attr('medId') + '?' + $(this).attr('params') + '&theme=light&autoplay=1" frameborder="0" allowfullscreen></iframe></div>');
		} else if (thisId == 'soundcloudExpand') {
			$(this).after('<div><iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + $(this).attr('medId') + '&amp;color=ff5500&amp;auto_play=true&amp;hide_related=false&amp;show_artwork=true"></iframe></div>');
		} else if (thisId == 'vocarooExpand') {
			$(this).after('<div style="width: 300px; background-color: #CAFF70; text-align: center; border-radius: 6px; margin-top: 3px; margin-bottom: 3px; padding-top: 5px; padding-bottom: 5px;"><embed src="http://vocaroo.com/mediafoo.swf?playMediaID=' + $(this).attr('medId') + '&amp;autoplay=1" width="220" height="140" type="application/x-shockwave-flash" pluginspage="http://get.adobe.com/flashplayer/"></div>');
		} else if (thisId == 'twitterExpand') {
			$(this).after('<div><blockquote class="twitter-tweet" data-lang="ru"><p lang="en" dir="ltr"><a href="https://twitter.com/' + $(this).attr('medId') + '">https://twitter.com/' + $(this).attr('medId') + '</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></div>');
		} else if (thisId == 'coubExpand') {
			$(this).after('<div><iframe src="//coub.com/embed/' + $(this).attr('medId') + '?muted=true&autostart=false&originalSize=false&startWithHD=false" allowfullscreen="true" frameborder="0" width="640" height="640"></iframe></div>');
		} else if (thisId == 'streamableExpand') {
			$(this).after('<div style="min-width: 300px; max-width: 80%; height: 0px; position: relative; padding-bottom: 50%;"><iframe src="//streamable.com/e/' + $(this).attr('medId') + '" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen scrolling="no" style="align: left; width: 100%; height: 100%; position: absolute;"></iframe><script async  src="//v.embedcdn.com/v1/embed.js"></script></div>');
		} else if (thisId == 'gfycatExpand') {
			$(this).after('<div style="min-width: 300px; max-width: 80%; height: 0px; position:relative; padding-bottom:50%"><iframe src="https://gfycat.com/ifr/' + $(this).attr('medId') + '" frameborder="0" scrolling="no" width="100%" height="100%" style="position:absolute;top:0;left:0;" allowfullscreen></iframe></div>');
		} else if (thisId == 'imgurExpand') {
			$(this).after('<div><blockquote class="imgur-embed-pub" lang="en" data-id="' + $(this).attr('medId') + '"><a href="//imgur.com/' + $(this).attr('medId') + '">http://imgur.com/' + $(this).attr('medId') + '</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>');
		} else if (thisId == 'giphyExpand') {
			$(this).after('<div><iframe src="//giphy.com/embed/' + $(this).attr('medId') + '" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/' + $(this).attr('medId') + '">via GIPHY</a></p></div>');
		} else if (thisId == 'instagramExpand') {
			$(this).after('<div><blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="7" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"><div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:28.10185185185185% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div><p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/' + $(this).attr('medId') + '" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">https://www.instagram.com/p/' + $(this).attr('medId') + '</a></p></div></blockquote><script async defer src="//platform.instagram.com/en_US/embeds.js"></script></div>');
		} else if (thisId == 'flashExpand') {
			$(this).after('<div><object type="application/x-shockwave-flash" data="' + $(this).attr('medId') + '" width="640" height="480"><param name="allowScriptAccess" value="sameDomain" /><param name="movie" value="' + $(this).attr('medId') + '" /><param name="quality" value="high" /><embed src="' + $(this).attr('medId') + '" quality="high" width="640" height="480" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object></div>');
		} else if (thisId == 'imageExpand') {
			$(this).after('<div><img src="' + $(this).attr('medId') + '"></div>');
		} else if (thisId == 'audioExpand') {
			$(this).after('<div><audio controls autoplay src="' + $(this).attr('medId') + '"></audio></div>');
		} else if (thisId == 'videoExpand') {
			$(this).after('<div><video controls autoplay src="' + $(this).attr('medId') + '"></video></div>');
		} else if (thisId == 'steamExpand') {
			$(this).after('<div><iframe src="https://store.steampowered.com/widget/' + $(this).attr('medId') + '" frameborder="0" height="190" width="800"></iframe></div>');
		} else if (thisId == 'beepboxExpand') {
			$(this).after('<div><iframe src="http://www.beepbox.co/embed.html#' + $(this).attr('medId') + '" frameborder="0" height="200" width="800"></iframe></div>');
		} else if (thisId == 'dailymotionExpand') {
			$(this).after('<div><iframe width="640" height="360" src="https://www.dailymotion.com/embed/video/' + $(this).attr('medId') + '?autoplay=1" frameborder="0" allowfullscreen></iframe></div>');
		} else if (thisId == 'vimeoExpand') {
			$(this).after('<div><iframe width="640" height="360" src="https://player.vimeo.com/video/' + $(this).attr('medId') + '?autoplay=1" frameborder="0" allowfullscreen></iframe></div>');
		} else if (thisId == 'pastebinExpand') {
			$(this).after('<div><iframe width="100%" height="360" src="http://pastebin.com/embed_iframe.php?i=' + $(this).attr('medId') + '" frameborder="0"></iframe></div>');
		} else if (thisId == 'p3dExpand') {
			$(this).after('<div><iframe src="https://p3d.in/e/' + $(this).attr('medId') + '+load" width="640" height="480" frameborder="0" seamless allowfullscreen webkitallowfullscreen></iframe></div>');
		} else if (thisId == 'googleDriveExpand') {
			$(this).after('<div><iframe src="https://drive.google.com/file/d/' + $(this).attr('medId') + '/preview" width="854" height="480" frameborder="0" seamless allowfullscreen webkitallowfullscreen></iframe></div>');
		} else if (thisId == 'embedlyExpand') {
			$(this).after('<div><a class="embedly-card" data-card-chrome="1" href="' + $(this).attr('medId') + '">' + $(this).attr('medId') + '</a><script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script></div>');
		}

		$(this).val("Remove");
		$(this).attr('expanded', 'true');
	} else {
		$(this).next().remove();
		$(this).val("Embed");
		$(this).attr('expanded', 'false');
	}
});

(function() {
  var css;

  css = " .embedMedia { color: blue; font-size: 1em; } \
        ";

  if (typeof GM_addStyle != "undefined") {
  	GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
  	PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
  	addStyle(css);
  } else {
  	var node = document.createElement("style");
  	node.type = "text/css";
  	node.appendChild(document.createTextNode(css));
  	var heads = document.getElementsByTagName("head");
  	if (heads.length > 0) {
  		heads[0].appendChild(node);
  	} else {
  		// no head yet, stick it whereever
  		document.documentElement.appendChild(node);
  	}
  }
})();
