CONTENT = (function(){

  var ELS_IDS = {
    YAMIXED_MODAL : 'yamixed-modal-window',
    MAIN_BODY : 'yamixed-ext-body',
    IFRAME : 'yamixed-iframe'
  };

  var parseMix = function(message){
  	 var title = message.tab.title;
  	 var url = message.tab.url;
  	 var descs = $('meta').filter(function(){
  	   var name = $(this).attr('name');
  	   return name && name.toLowerCase().indexOf('description') > -1;
  	 });
  	 var description = '';
     if(descs.length > 0){
       description = descs[0].content == null ? '' : descs[0].content;
     } 
     var images = [];
     $('img').each(function(i,n){
       if(i < 20){
         var src = $(n).attr('src');
         if(src){
           src = COMMON.absolute(src);
           images.push(src);
         } 
       }
     });
     return {
       url : url,
       title : title,
       description : description,
       images : images
     };
  }; 

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if('parseLink' == message.action){
  	  var mix = parseMix(message);
      sendResponse(mix); 
    }
    else if('openUrm' == message.action){
       $.get(chrome.extension.getURL('/content/contentWrapper.html'), function(data) {
          $('#' + ELS_IDS.MAIN_BODY).remove();
          $('body').append(data);
          centerIframe(true);
          sendResponse();
       });
    }
    else if('close' == message.action){
       $('#' + ELS_IDS.MAIN_BODY).remove();
    }
    else if('showPage' == message.action){
       var $iframe = $('#' + ELS_IDS.IFRAME);
       $iframe.attr('src',message.url).attr('width',message.width).css('width',message.width);
       centerIframe(true);
    }
  });


  var centerIframe = function(resetTop){
     var w = $(window).width();
     var $main_body = $('#' + ELS_IDS.MAIN_BODY);
     if(resetTop){
       var h = $(document).scrollTop();
       $main_body.css('top',h + 40 + 'px');
     }
     
     $main_body.css('left',w/2-$main_body.width()/2 + 'px');
     $main_body.show();
  };


  var lastScrollTop = 0; 
  $(window).resize(function(){
     setTimeout(function(){
        centerIframe(true);
     },50);
  }).scroll(function(){
     var up = true;
     var st = $(this).scrollTop();
     if (st > lastScrollTop){
       up = false; 
     }
     lastScrollTop = st;
     setTimeout(function(){
        centerIframe(up);
     },50);
  });
})();
