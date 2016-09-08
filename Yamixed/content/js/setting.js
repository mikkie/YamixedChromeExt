Setting = (function() {

  var ELS_IDS = {
    GO_BACK : 'logo',
    SPACE : 'space',
    GROUP : 'group',
    SPACE_UL : 'spaceUl',
    GROUP_UL : 'groupUl',
    SPACE_AREA : 'spaceArea',
    GROUP_AREA : 'groupArea'
  };  

  var ELS_CLASS = {
    NEW_SPACE : 'newSpace',
    NEW_GROUP : 'newGroup',
    CLOSE : 'close' 
  };


  var showPage = function(url,width,height){
    chrome.runtime.sendMessage({action:'showPage',url : chrome.extension.getURL(url), width : width,height : height}); 
  };

  
  var bind = {
      close : function(){
         $('.' + ELS_CLASS.CLOSE).click(function(){
            chrome.runtime.sendMessage({action:'close'});
         });
      },
      goback : function(){
        $('#' + ELS_IDS.GO_BACK).click(function(){
            showPage("content/content.html",'900px','600px');
        });
      },
      space : function(){
        $('#' + ELS_IDS.SPACE).click(function(){
           var $ul = $('#' + ELS_IDS.SPACE_UL);
           if($ul.is(':visible')){
              $('#' + ELS_IDS.GROUP_UL).show(500);
              $('#' + ELS_IDS.GROUP_AREA).show(500);
              $('#' + ELS_IDS.SPACE_AREA).hide(500);
              $ul.hide(500);
           }
           else{
              $('#' + ELS_IDS.GROUP_UL).hide(500);
              $('#' + ELS_IDS.GROUP_AREA).hide(500);
              $('#' + ELS_IDS.SPACE_AREA).show(500);
              $ul.show(500);
           }
        });
      },
      group : function(){
        $('#' + ELS_IDS.GROUP).click(function(){
           var $ul = $('#' + ELS_IDS.GROUP_UL);
           if($ul.is(':visible')){
              $('#' + ELS_IDS.SPACE_UL).show(500);
              $('#' + ELS_IDS.SPACE_AREA).show(500);
              $('#' + ELS_IDS.GROUP_AREA).hide(500);
              $ul.hide(500);
           }
           else{
              $('#' + ELS_IDS.SPACE_UL).hide(500);
              $('#' + ELS_IDS.SPACE_AREA).hide(500);
              $('#' + ELS_IDS.GROUP_AREA).show(500);
              $ul.show(500);
           }
        });
      },
      new_space : function(){
        $('.' + ELS_CLASS.NEW_SPACE).click(function(){
           showPage('content/newSpace.html','600px','600px'); 
        });
      },
      new_group : function(){
        $('.' + ELS_CLASS.NEW_GROUP).click(function(){
           showPage('content/newGroup.html','600px','600px'); 
        });
      }
  };

  var init = function(){
     for(var m in bind){
        if(typeof bind[m] == 'function'){
           bind[m]();
        }
     }
  };
  
  return {
  	init : init
  };

})();
$(document).ready(Setting.init);