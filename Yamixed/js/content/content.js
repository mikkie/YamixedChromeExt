CONTENT = (function(){

  var ELS_IDS = {
    YAMIXED_MODAL : 'yamixed-modal-window',
    MAIN_BODY : 'yamixed-ext-body',
    IFRAME : 'yamixed-iframe'
  };

  var ELS_CLASS = {
   YA_NOTE : 'yamixed-note',
   YA_HIGHTLIGHT : 'yamixed-highlight'
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
            url : host + '/login/autoLogin',
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
            url : host + '/login/autoLogin',
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


  var openNotePage = function(note){
    $.get(chrome.extension.getURL('/content/contentWrapper.html'), function(data) {
        $('#' + ELS_IDS.MAIN_BODY).remove();
        $('body').append(data);
        chrome.storage.sync.set({"yamixedNote" : note},function(data){
          openDialog(chrome.extension.getURL('/content/note.html'),true,{width : '900px',height : '600px'});
        });
    });
  };

  var openNote = function(note){
     chrome.storage.sync.get('user',function(data){
       if(data && data.user){
          $.ajax({
            url : host + '/login/autoLogin',
            dataType : 'json',
            type : 'post',
            data : {
              email : data.user.email,
              token : data.user.autoLoginToken
            }
          }).done(function(data){
              if(data.success){
                 openNotePage(note);
              }
              else{
                 openLogin();
              }
          }).fail(function(){
              openLogin();
          });
       }
       else{
          openLogin();
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


  var clearOldNote = function(note){
    lowlightNote(note);
    var $note = $('#yamixed-note-' + note._id);
    if($note.length == 1){
      $note.remove();
    }
  }

  var highlightNote = function(sentence,note,callback){
      //1.remove old if exist  
      clearOldNote(note);
      //2.use line hight light
      $('body').highlight(sentence,note);
      //3.if line high light not work
      if($('#yamixed-note-' + note._id).length == 0){
          var $noteBtn = $('<div class="yamixed-highlight" style="z-index:999999;opacity:0.8;cursor:pointer;position:absolute;"><img src="chrome-extension://fjkkoeppfmigfbienchpdjcinogmccai/images/logo_24x24G.jpg"/></div>');
          $noteBtn.attr('id','yamixed-note-' + note._id);
          $noteBtn.data('note',note);
          $noteBtn.css('top',note.y + 'px').css('left',note.x + 'px');
          $('body').append($noteBtn);
      }
      if(callback == 'function'){
        callback();
      }
  };


  var lowlightNote = function(note,callback){
      $('body').lowlight(note);
      if($('#yamixed-note-' + note._id).length == 1){
          $('#yamixed-note-' + note._id).remove();
      }
      if(callback == 'function'){
        callback();
      }
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
    else if('highlight' == message.action){
       highlightNote(message.note.sentence,message.note,sendResponse); 
    }
    else if('lowlight' == message.action){
       lowlightNote(message.note,sendResponse);
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
     $(window).hotKey({ key: 'y', modifier: 'alt' }, function () {
        checkAutoLogin();
     });
     $(window).hotKey({ key: 'o', modifier: 'alt' }, function () {
        openLogin();
     });
     $(window).hotKey({ key: 'n', modifier: 'alt' }, function () {
        openBookmark();
     });
  })();


  var bind = {
    newNote : function(){
      var getSelected = function () {
        if (window.getSelection) return window.getSelection();
        if (document.getSelection) return document.getSelection();
        if (document.selection) return document.selection.createRange().text;
      };
      $('body').mouseup(function(e){
         var sentence = $.trim(getSelected().toString());
         if(sentence && $('.' + ELS_CLASS.YA_NOTE).length == 0){
           if(sentence.length > 10000){
              alert('亲,所选文字太长了...');
              return false;
           }
           var $noteBtn = $('<div class="yamixed-note" style="z-index:999999;opacity:0.8;cursor:pointer;position:absolute;"><img src="chrome-extension://fjkkoeppfmigfbienchpdjcinogmccai/images/logo_24x24.jpg"/></div>');
           var x = e.pageX + 15;
           var y = e.pageY + 15;
           $noteBtn.css('top',y + 'px');
           $noteBtn.css('left',x + 'px');
           $noteBtn.data('note',{sentence : sentence,x : x,y : y, url : window.location.href});
           $('body').append($noteBtn);
         }
         else{
           $('.' + ELS_CLASS.YA_NOTE).remove();
         }
      });
    },
    editNote : function(){
      $('body').on('mouseup','.' + ELS_CLASS.YA_NOTE,function(){
        var $this = $(this);
        openNote($this.data('note'));
      });
    },
    highlight_click : function(){
      $('body').on('mouseup','.' + ELS_CLASS.YA_HIGHTLIGHT,function(){
        openNote($(this).data('note'));
        return false;
      });
    }
  };

  var loadNotes = function(){
    chrome.storage.sync.get('user',function(data){
      if(data.user){
        $.ajax({
          url : host + '/note/search',
          dataType : 'json',
          type : 'post',
          data : {
            url : window.location.href,
            owner : data.user._id
          }
        }).done(function(data){
          if(data.success && data.success.length > 0){
             var notes = data.success[0].notes;
             if(notes && notes.length > 0){
              for(var i in notes){
                notes[i].url = data.success[0].url;
                notes[i].owner = data.success[0].owner;
                if(notes[i].valid){
                   highlightNote(notes[i].sentence,notes[i]);
                }
              }
             }
           } 
        }); 
      }
    });
  };

  (function(){
    for(var k in bind){
       if(typeof bind[k] == 'function'){
          bind[k]();
       }
    }
    syncContent4GlobalSearch();
    loadNotes();
  })();

})();
