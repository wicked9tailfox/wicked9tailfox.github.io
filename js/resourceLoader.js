/*
* 资源加载器
*/
(function(){
  var resLoader={},
  idNum=0,
  cfg,
  store={};

  function createId(){
  	return '@'+(idNum++);
  }


  resLoader.config = function(setting){
  	$.extend(cfg,setting);
  }

  resLoader.createCat = function(catName){
  	var id = createId();
  	store[id] = {name:catName,items:[]};
  	resLoader.curCatId = id;
  	return resLoader;
  }

  resLoader.addItem=function(itemName,itemLink,itemDesc){
  	var curCatId = resLoader.curCatId;
  	var data = {
  		name:itemName,
  		link:itemLink,
  		desc:itemDesc||''
  	}
  	store[curCatId].items.push(data);
  	return resLoader;
  }

  resLoader.render = function(){
  	var container = $('<div>').addClass('main-container');
  	$.each(store,function(id,catData){
  		var h2=$('<h2>').addClass('tit'),list,ul=$('<ul>').addClass('catContainer clearfix');
  		h2.text(catData.name);
  		$.each(catData.items,function(index,item){
  			var li = $('<li>'),itemObj;
  			itemObj = $('<a>').attr({href:item.link,target:'_blank'}).html('<span>'+item.name+'</span><b>'+item.desc+'</b>'); 
  			li.append(itemObj);
  			ul.append(li);
  		});
  		container.append(h2).append(ul);
  		$('body').append(container);
  	});
  };




  window.resLoader = resLoader; 
  window.store = store;
})(window,$)