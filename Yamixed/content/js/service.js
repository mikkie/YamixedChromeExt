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
          if(typeof option.postHook == 'function'){
             option.postHook(data);
          }
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
        url : Y_COMMON.config.server.host + '/space/getUserSpace',
        localKey : 'userSpace',
        data : {
          spaceIds : spaceIds
        }
     };
     return post(option);
  };


  service.getLinksBySpace = function(spaceId){
     var option = {
        url : Y_COMMON.config.server.host + '/link/getLinksBySpace',
        data : {
          spaceId : spaceId
        }
     };
     return post(option);
  };


  service.postNewLink = function(newLink){
     var option = {
        url : Y_COMMON.config.server.host + '/link/postNewLink',
        data : newLink
     };
     return post(option);
  };


  service.searchLinks = function(spaceId,keyword,tag){
     var option = {
        url : Y_COMMON.config.server.host + '/link/searchLinks',
        data : {
          spaceId : spaceId,
          keyword : keyword,
          tag : tag
        }
     };
     return post(option);
  };

  service.searchLinksFromAddressBar = function(userId,keyword){
     var option = {
        url : Y_COMMON.config.server.host + '/link/searchLinksFromAddressBar',
        data : {
          userId : userId,
          keyword : keyword
        }
     };
     return post(option);
  };



  service.updateLinkVisitTime = function(linkId){
     var option = {
        url : Y_COMMON.config.server.host + '/link/updateLinkVisitTime',
        data : {
          linkId : linkId
        }
     };
     return post(option);
  };


  service.deleteLink = function(linkId){
    var option = {
        url : Y_COMMON.config.server.host + '/link/deleteLink',
        data : {
          linkId : linkId
        }
     };
     return post(option);
  };


  service.getLinkById = function(linkId){
    var option = {
        url : Y_COMMON.config.server.host + '/link/getLinkById',
        localKey : 'newPageData',
        data : {
          linkId : linkId
        },
        postHook : function(data){
           if(data.success){
              data.success.content = '';
           }  
        }
     };
     return post(option);
  };



  service.getUserByNameOrEmail = function(keyword) {
    return get({url : Y_COMMON.config.server.host + '/account/getUsersByNameOrEmail?keyword=' + keyword});
  };


  service.createNewGroup = function(id,name,color,users,owner){
     var option = {
        url : Y_COMMON.config.server.host + '/group/new',
        data : {
          id : id,
          name : name,
          color : color,
          users : users,
          owner : owner
        }
     };
     return post(option);
  };

  service.createNewSpace = function(id,name,color,groups,owner){
     var option = {
        url : Y_COMMON.config.server.host + '/space/new',
        data : {
          id : id,
          name : name,
          color : color,
          groups : groups,
          owner : owner
        }
     };
     return post(option);
  };

  service.joinSpace = function(userId,spaceId){
     var option = {
        url : Y_COMMON.config.server.host + '/space/join',
        data : {
          userId : userId,
          spaceId : spaceId
        }
     };
     return post(option);
  };



  service.findGroupByName = function(name){
     return get({url : Y_COMMON.config.server.host + '/group/findGroupByName?name=' + name});
  };

  service.findGroupById = function(groupId){
     return get({url : Y_COMMON.config.server.host + '/group/findGroupById?groupId=' + groupId});
  };

  service.findGroupByNameLike = function(name,owner){
     return get({url : Y_COMMON.config.server.host + '/group/findGroupByNameLike?name=' + name + '&owner=' + owner});
  };

  service.findSpaceByName = function(name){
     return get({url : Y_COMMON.config.server.host + '/space/findSpaceByName?name=' + name});
  };

  service.findSpaceById = function(spaceId){
     return get({url : Y_COMMON.config.server.host + '/space/findSpaceById?spaceId=' + spaceId});
  };

  service.getUserCreatedSpaces = function(userId,valid){
     return get({url : Y_COMMON.config.server.host + '/space/getUserCreatedSpaces?userId=' + userId + (valid ? '&valid=' + valid : '')});
  };

  service.getUserCreatedGroups = function(userId){
     return get({url : Y_COMMON.config.server.host + '/group/getUserCreatedGroups?userId=' + userId});
  };

  service.getMessagesToUser = function(userId){
     return get({url : Y_COMMON.config.server.host + '/message/getMessagesToUser?userId=' + userId});
  };

  service.disableMessage = function(messageId){
     return get({url : Y_COMMON.config.server.host + '/message/disableMessage?messageId=' + messageId});
  };

  service.getUserById = function(userId){
     return get({url : Y_COMMON.config.server.host + '/account/getUserById?userId=' + userId});
  };

  service.checkRWPermission = function(spaceId,userId){
     return get({url : Y_COMMON.config.server.host + '/space/checkRWPermission?spaceId=' + spaceId + '&userId=' + userId});
  };

  service.disableSpace = function(spaceId){
     return get({url : Y_COMMON.config.server.host + '/space/disableSpace?spaceId=' + spaceId});
  };
  
  service.disableGroup = function(groupId){
     return get({url : Y_COMMON.config.server.host + '/group/disableGroup?groupId=' + groupId});
  };

  service.syncBookmarkToYamixed = function(nodes,spaceId,owner){
    var option = {
        url : Y_COMMON.config.server.host + '/space/init',
        data : {
          nodes : nodes,
          spaceId : spaceId,
          owner : owner
        }
     };
     return post(option);
  };

  service.syncSingleBookmarkToYamixed = function(bookmark,spaceId,owner){
    var option = {
        url : Y_COMMON.config.server.host + '/space/syncBookmark',
        data : {
          bookmark : bookmark,
          spaceId : spaceId,
          owner : owner
        }
     };
     return post(option);
  };

  service.saveNote = function(id,space,content,sentence,url,x,y,owner,tags){
    var option = {
        url : Y_COMMON.config.server.host + '/note/new',
        data : {
          id : id,
          space : space,
          content : content,
          sentence : sentence,
          url : url,
          x : x,
          y : y,
          owner : owner,
          tags : tags
        }
     };
     return post(option);
  };

  service.delNote = function(id,url,owner){
    var option = {
        url : Y_COMMON.config.server.host + '/note/delete',
        data : {
          id : id,
          url : url,
          owner : owner
        }
    };
    return post(option);
  };

	return service;

})(jQuery);