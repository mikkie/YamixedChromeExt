MAIN = (function() {

  var ELS_IDS = {
  	 MAIN_AREA : 'mainArea' 
  };	


  
  var bind = {
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
$(document).ready(MAIN.init);