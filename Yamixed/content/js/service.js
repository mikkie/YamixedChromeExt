Service = (function($) {

	var service = {};

	var post = function(option){
       var d = $.Deferred();
       var setting = {
       	  dataType : 'json',
          type : 'post'
       };
       option = $.extend(setting,option);
       $.ajax(option).done(function(data){
          if(option.localKey){
             var localDate = {};
             localDate[option.localKey] = data;  
             chrome.storage.sync.set(localDate);
          }
          d.resolve(data);
       }).fail(function(){
          if(typeof option.failFun == 'function'){
             option.failFun.call();
          } 
          d.reject();
       });
       return d.promise();
	};


	var get = function(option){
       var d = $.Deferred();
       $.get(option.url,function(data){
          //store data in local
          if(option.localKey){
             var localDate = {};
             localDate[option.localKey] = data;  
             chrome.storage.sync.set(localDate);
          }
          d.resolve(data);
       },'json');
       return d.promise();
	};

    
  service.getUserSpaces = function(space){
     var spaceIds = '';
     spaceIds += space.created.join(',');
     if(space.joined.length > 0){
        spaceIds += ("," + space.joined.join(',')); 
     }
     var option = {
        url : 'http://localhost:3000/space/getUserSpace',
        localKey : 'userSpace',
        data : {
          spaceIds : spaceIds
        }
     };
     return post(option);
  };


  service.getLinksBySpace = function(spaceId){
     var option = {
        url : 'http://localhost:3000/link/getLinksBySpace',
        data : {
          spaceId : spaceId
        }
     };
     return post(option);
  };


  service.postNewLink = function(newLink){
     var option = {
        url : 'http://localhost:3000/link/postNewLink',
        data : newLink
     };
     return post(option);
  };


  service.searchLinks = function(spaceId,keyword,tag){
     var option = {
        url : 'http://localhost:3000/link/searchLinks',
        data : {
          spaceId : spaceId,
          keyword : keyword,
          tag : tag
        }
     };
     return post(option);
  };


  service.updateLinkVisitTime = function(linkId){
     var option = {
        url : 'http://localhost:3000/link/updateLinkVisitTime',
        data : {
          linkId : linkId
        }
     };
     return post(option);
  };


  service.deleteLink = function(linkId){
    var option = {
        url : 'http://localhost:3000/link/deleteLink',
        data : {
          linkId : linkId
        }
     };
     return post(option);
  };


  service.getLinkById = function(linkId){
    var option = {
        url : 'http://localhost:3000/link/getLinkById',
        localKey : 'newPageData',
        data : {
          linkId : linkId
        }
     };
     return post(option);
  };



  service.getUserByNameOrEmail = function(keyword) {
    return get({url : 'http://localhost:3000/account/getUsersByNameOrEmail?keyword=' + keyword});
  };


  service.createNewGroup = function(name,users,owner){
     var option = {
        url : 'http://localhost:3000/group/new',
        data : {
          name : name,
          users : users,
          owner : owner
        }
     };
     return post(option);
  };

  service.createNewSpace = function(name,groups,owner){
     var option = {
        url : 'http://localhost:3000/space/new',
        data : {
          name : name,
          groups : groups,
          owner : owner
        }
     };
     return post(option);
  };

  service.findGroupByName = function(name){
     return get({url : 'http://localhost:3000/group/findGroupByName?name=' + name});
  };

  service.findGroupByNameLike = function(name){
     return get({url : 'http://localhost:3000/group/findGroupByNameLike?name=' + name});
  };

  service.findSpaceByName = function(name){
     return get({url : 'http://localhost:3000/space/findSpaceByName?name=' + name});
  };

	return service;

})(jQuery);