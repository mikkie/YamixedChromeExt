NEW_MIX = (function($){

	var ELS_IDS = {
      URL_ADDRESS : 'urladdress',
      TITLE : 'title',
      DESC : 'desc',
      CATEGORY_TEMP : 'categoryTemp',
      CATE_SEL : 'categoriesSel',
      IMAGE_HOLDER : 'imageHolder'
	};

	var ELS_CLASS = {
		PREVIEW_IMG : 'previewImg'
	};
	
	var init = function(){
		var mixStr = window.sessionStorage.getItem('newMix');
		if(!mixStr){
           return;
		}
		var data = JSON.parse(mixStr);
		$('#' + ELS_IDS.URL_ADDRESS).val(data.mix.url);
		$('#' + ELS_IDS.TITLE).val(data.mix.title);
		$('#' + ELS_IDS.DESC).val(data.mix.description);
		buildCategories(data.categories);
		buildImages(data.mix.images);
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