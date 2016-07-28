NEW_MIX = (function($){

	var ELS_IDS = {
	  IMG_URL : 'imageUrl',
      URL_ADDRESS : 'urladdress',
      TITLE : 'title',
      DESC : 'desc',
      CATEGORY_TEMP : 'categoryTemp',
      CATE_SEL : 'categoriesSel',
      IMAGE_HOLDER : 'imageHolder',
      IMG_LINK : 'imglink',
	  LINK_IMG : 'linkimg',
	  CHK_IMG_LINK : 'chkimglink',
	  SAVE_MIX : 'saveMix',
	  IMG_LINK_DIV : 'imglinkDiv'
	};

	var ELS_CLASS = {
		PREVIEW_IMG : 'previewImg'
	};
	

    var bind = {
        previewImg_click : function(){
			$('.' + ELS_CLASS.PREVIEW_IMG).on('click',function(){
				var $this = $(this); 
				var src = $this.attr('src');
				$('#' + ELS_IDS.IMG_URL).val(src);
				$('.' + ELS_CLASS.PREVIEW_IMG).css('border','1px solid #ddd');
				$this.css('border','2px solid #FF8F00');
			});  
		},
		image_link_focusout : function(){
			$('#' + ELS_IDS.IMG_LINK).focusout(function(){
				var imglink = $(this).val();
				if(imglink){
					var $linkimg = $('#' + ELS_IDS.LINK_IMG);
					$linkimg.attr('src',imglink);
					$linkimg.trigger('click');
					$('#' + ELS_IDS.IMG_LINK_DIV).show();
				}
			});
		},
		chk_imagelink_click : function(){
			$('#' + ELS_IDS.CHK_IMG_LINK).click(function(){
				if($(this).is(':checked')){
					var $imglink = $('#' + ELS_IDS.IMG_LINK);
					$imglink.removeAttr('readonly');
					if($imglink.val()){
						$('#' + ELS_IDS.LINK_IMG).trigger('click');
						$('#' + ELS_IDS.IMG_LINK_DIV).show();
					} 
				}
				else{
					var $imglink = $('#' + ELS_IDS.IMG_LINK);
					$imglink.attr('readonly','readonly');
					$('#' + ELS_IDS.IMG_LINK_DIV).hide();
					$('.' + ELS_CLASS.PREVIEW_IMG +':first').trigger('click');
				}
			});
		},
		save_mix_click : function(){
			$('#' + ELS_IDS.SAVE_MIX).click(function(){
				var $title = $('#' + ELS_IDS.TITLE);
				if(!$title.val()){
					$title.focus(); 
					return;
				}
				var $desc = $('#' + ELS_IDS.DESC);
				if(!$desc.val()){
					$desc.focus(); 
					return;
				}
                COMMON.ajax({
                   url : CONFIG.host + CONFIG.url.newMix,
                   data : JSON.stringify({
                    	url : $('#' + ELS_IDS.URL_ADDRESS).val(),
                    	title : $title.val(),
                    	desc : $desc.val(),
                    	category : $('#' + ELS_IDS.CATE_SEL).val(),
                    	imageUrl : $('#' + ELS_IDS.IMG_URL).val()
                   }),
                   callback : function(data){
                      if(data.success){
                         openNotofication(data.success);
                      }
                      else{
                      	 COMMON.logError('服务器开小差了');
                      }
                   }
                });
			});
		}
    };


    var openNotofication = function(mix){
       var url = CONFIG.host + '/comment/view?mixId=' + mix.id; 	
       chrome.notifications.create(url, {
       	  type : 'basic',
          iconUrl : mix.previewImgUrl,
          title : 'Yamixed -' + mix.title,
          message : mix.description,
          isClickable : true
       }, function(notificationId){
       	  window.close();
       });
    };


	var init = function(){
		var mixStr = window.sessionStorage.getItem('newMix');
		if(!mixStr){
           return;
		}
		var data = JSON.parse(mixStr);
		if(!data.mix){
           return;
		}
		$('#' + ELS_IDS.URL_ADDRESS).val(data.mix.url);
		$('#' + ELS_IDS.TITLE).val(data.mix.title);
		$('#' + ELS_IDS.DESC).val(data.mix.description);
		buildCategories(data.categories);
		buildImages(data.mix.images);
		for(var m in bind){
           if(typeof bind[m] == 'function'){
              bind[m](); 
           }
		}
	};


	var buildCategories = function(categories){
	   var $cate_sel = $('#' + ELS_IDS.CATE_SEL);
	   $cate_sel.empty();
	   for(var i in categories){
         $cate_sel.append('<option value="'+ categories[i].id +'">'+ categories[i].name +'</option>');
	   }	
	};

	var buildImages = function(images){
       var $image_holder = $('#' + ELS_IDS.IMAGE_HOLDER);
       $image_holder.empty();
       if(images && images.length > 0){
          for(var i in images){
             $image_holder.append('<a href="javascript:void(0);"><img src="'+ images[i] +'" alt="..." class="img-thumbnail previewImg"></a>');
          }
       }
	};
	
	return {
		init : init
	}
})(jQuery);
$(document).ready(NEW_MIX.init);