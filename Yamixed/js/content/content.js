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


  var openUrm = function(callback){
     $.get(chrome.extension.getURL('/content/contentWrapper.html'), function(data) {
          $('#' + ELS_IDS.MAIN_BODY).remove();
          $('body').append(data);
          openDialog(null,true,{width : '900px'});
          if(callback == 'function'){
             callback();
          }
     });
  }; 


  var checkAutoLogin = function(callback){
     chrome.storage.sync.get('user',function(data){
       if(data && data.user){
          $.ajax({
            url : 'http://localhost:3000/login/autoLogin',
            dataType : 'json',
            type : 'post',
            data : {
              email : data.user.email,
              token : data.user.autoLoginToken
            }
          }).done(function(data){
              if(data.success){
                 openUrm(callback);
              }
              else{
                 openLogin(callback);
              }
          }).fail(function(){
              openLogin(callback);
          });
       }
       else{
          openLogin(callback);
       }
     });
  };



  var openLogin = function(callback){
     $.get(chrome.extension.getURL('/content/contentWrapper.html'), function(data) {
          $('#' + ELS_IDS.MAIN_BODY).remove();
          $('body').append(data);
          openDialog(chrome.extension.getURL('/content/login.html'),true,{width : '400px',height : '300px'});
          if(callback == 'function'){
             callback();
          }
     });
  };


  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if('parseLink' == message.action){
  	  var mix = parseMix(message);
      sendResponse(mix); 
    }
    else if('openUrm' == message.action){
       checkAutoLogin(sendResponse);
    }
    else if('close' == message.action){
       $('#' + ELS_IDS.MAIN_BODY).remove();
    }
    else if('showPage' == message.action){
       openDialog(message.url,true,{width : message.width,height : message.height});
    } 
    else if('parsePage' == message.action){
       parsePage(sendResponse);
    }
  });

  var parsePage = function(sendResponse){
     var title = $('title').text();
     var description = $('meta[name="description"]').attr('content');
     var images = $('img');
     sendResponse({
        title : title,
        description : description,
        images : images
     });
  };


  var openDialog = function(src,resetTop,css){
     //set src
     var $iframe = $('#' + ELS_IDS.IFRAME);
     if(src){
       $iframe.attr('src',src);
     }
     //set size
     if(css){
       if(css.width){
          $iframe.attr('width',css.width).css('width',css.width);
       }
       if(css.height){
          $iframe.attr('height',css.height).css('height',css.height); 
       }
     }
     //set position
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
        openDialog(null,true,null);
     },50);
  }).scroll(function(){
     var up = true;
     var st = $(this).scrollTop();
     if (st > lastScrollTop){
       up = false;
     }
     lastScrollTop = st;
     setTimeout(function(){
        openDialog(null,up,null);
     },50);
  });


  (function binding(){
     $(document).hotKey({ key: 'y', modifier: 'alt' }, function () {
        checkAutoLogin();
     });
     $(document).hotKey({ key: 'o', modifier: 'alt' }, function () {
        openLogin();
     });
  })();

})();
