CONTENT = (function(){

  var ELS_IDS = {
    YAMIXED_MODAL : 'yamixed-modal-window',
    MAIN_BODY : 'yamixed-ext-body',
    IFRAME : 'yamixed-iframe'
  };

  var host = 'https://localhost:3000';

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
            url : 'https://localhost:3000/login/autoLogin',
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


  var openBookmarkPage = function(callback){
     var pageData = getPageData();
     chrome.storage.sync.set({'newPageData' : pageData},function(){
        $.get(chrome.extension.getURL('/content/contentWrapper.html'), function(data) {
          $('#' + ELS_IDS.MAIN_BODY).remove();
          $('body').append(data);
          openDialog(chrome.extension.getURL('/content/newBookmark.html'),true,{width : '600px',height : '600px'});
          if(callback == 'function'){
             callback();
          }
        });
     });
  };

  var openBookmark = function(callback){
    chrome.storage.sync.get('user',function(data){
       if(data && data.user){
          $.ajax({
            url : 'https://localhost:3000/login/autoLogin',
            dataType : 'json',
            type : 'post',
            data : {
              email : data.user.email,
              token : data.user.autoLoginToken
            }
          }).done(function(data){
              if(data.success){
                 openBookmarkPage(callback);
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
    else if('openBookmark' == message.action){
       openBookmark(sendResponse);
    }
  });


  var findDescription = function(){
      var description = '';
      for(var i = 1; i <= 4; i++){
         $('h' + i).each(function(){
            var text = $(this).text();
            if(text && /\w+\s+\w+/.test(text)){
              description = text;
              return false;   
            } 
         });
         if(description){
            break;
         } 
      }
      return description;
  };


  var getPageData = function(){
     var title = $('title').text();
     var description = $('meta[name="description"]').attr('content');
     if(!description){
        description = findDescription();
     }
     var $images = $('img[src]');
     var images = [];
     $images.each(function(i,n){
        if(i < 5){
           var src = $(n).attr('src');
           src = absolute(src);
           images.push(src);
        }
     });
     return {
        url : window.location.href,
        title : title,
        description : description,
        images : images
     };
  };

  var parsePage = function(sendResponse){
     var data = {};
     if(/^(http|https)/.test(window.location.href)){
        data = getPageData();
     }
     sendResponse(data);
  };

  var absolute = function(url){
      var base = window.location.href;
      if(/:\/\//.test(url))return url; // url is absolute
      // let's try a simple hack..
      var basea=document.createElement('a'), urla=document.createElement('a');
      basea.href=base, urla.href=url;
      urla.protocol=basea.protocol;// "inherit" the base's protocol and hostname
      if(!/^\/\//.test(url))urla.hostname=basea.hostname; //..hostname only if url is not protocol-relative  though
      if( /^\//.test(url) )return urla.href; // url starts with /, we're done
      var urlparts=url.split(/\//); // create arrays for the url and base directory paths
      var baseparts=basea.pathname.split(/\//); 
      if( ! /\/$/.test(base) )baseparts.pop(); // if base has a file name after last /, pop it off
      while( urlparts[0]=='..' ){baseparts.pop();urlparts.shift();} // remove .. parts from url and corresponding directory levels from base
      urla.pathname=baseparts.join('/')+'/'+urlparts.join('/');
      return urla.href;
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



  var syncContent4GlobalSearch = function(){
     chrome.storage.sync.get('user',function(data){
       if(data.user){
          $.ajax({
            url : host + '/link/findLinkByUrlAndOwner',
            dataType : 'json',
            type : 'post',
            data : {
              url : window.location.href,
              owner : data.user._id
            }  
          }).done(function(data){
            if(data.success && data.success.length > 0){
               updateContent(data.success);
            }  
          });
       }   
     });
  };


  var updateContent = function(links){
     var content = $('body').text();
     for(var i in links){
        if(links[i].content){
           continue;   
        }
        $.ajax({
          url : host + '/link/updateContent',
          dataType : 'json',
          type : 'post',
          data : {
            linkId : links[i]._id,
            content : content
          }
        }).done(function(data){}); 
     }
  };


  (function binding(){
     $(document).hotKey({ key: 'y', modifier: 'alt' }, function () {
        checkAutoLogin();
     });
     $(document).hotKey({ key: 'o', modifier: 'alt' }, function () {
        openLogin();
     });
     $(document).hotKey({ key: 'n', modifier: 'alt' }, function () {
        openBookmark();
     });
  })();

  $(document).ready(function(){
    syncContent4GlobalSearch();
  });

})();
