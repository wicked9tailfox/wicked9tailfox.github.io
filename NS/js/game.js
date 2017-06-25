var game = {
	nsData : Girls,  //NV数据--girls.js
	nsSelectedData : [], //选出一批NS数据
	nsWinNum : 0, //获得的芳心数
	giftsData : Gifts, //礼物数据--gifts.js
	giftsSelectedData : [], //与选出NS对应的gift数据
	giftsNum : 10,  //拥有的礼物数
	resultsData : Results, //成绩评语数据
	curGiftIds : [], //当前礼物对应的NS的id
	gameOn : false, //游戏是否开始 
	nsBonuIds:[],  //有彩蛋的NS的id
	nsSetedNum:8,
	nsSetKeepTime:0,
	bonuOfKeep:0,  
	lastingHits:0,
	spliceArrGroup :function(targetArr, amount){
		var i,
		len = targetArr.length,
		rand,
		newarr = new Array();
		for (i = amount; i>0; i--) {
			rand = Math.floor(Math.random() * len);
			newarr.push(targetArr.splice(rand, 1)[0]);
			len = targetArr.length;
		}
		if (amount == 1){
			return newarr[0];
		}else{
			return newarr;
		}	
	},
	selectNsData : function (num) {
		var _this=this,arr = this.spliceArrGroup(this.nsData, num);
		$.each(arr,function(index,val){
				if(val.bonus){
					_this.nsBonuIds.push(val.id);
				}
		});
		this.nsSelectedData = arr;
	},
	selectGiftsData : function () {
		var _this = this,
		nsSelectedData = this.nsSelectedData,
		giftsData = this.giftsData,
		selectedGiftData = [];
		$.each(nsSelectedData, function (index, value){
			var id = value.id,
			eqArr = [],
			temp,
			rand; //eqArr,记录符合此id的成员序列

			$.each(giftsData, function (eq, val) { //val是一条gift数据。需要查找id是否在ids中
				var ids = val.ids;
				if ($.inArray(id, ids) > -1) {
					eqArr.push(eq);
				};
			});

			if (eqArr.length == 1) {
				temp = _this.giftsData.splice(eqArr[0], 1)[0];
			} else if (eqArr.length > 1) {
				rand = Math.floor(Math.random() * eqArr.length);
				temp = _this.giftsData.splice(eqArr[rand], 1)[0];
			} else {
				temp = _this.giftsData.pop();
			};

			selectedGiftData.push(temp);
			giftsData = _this.giftsData;
		});


		this.giftsSelectedData = selectedGiftData;
		//this.giftsNum = selectedGiftData.length;
	},
	initNsBox : function () {
		var data = this.nsSelectedData,
		len = this.nsSelectedData.length;
		for (var i = 0; i < len; i++) { 
			this.fillNsCard(i,data[i]);
		};

		this.displayGiftsNum(this.giftsNum);
		this.displayNsNum(this.nsWinNum);
	},
	fillNsCard:function(id,data){
			  $('#g-card' + id).find('.g-card-inner').css('background-position','-'+50*data.id+'px top');	
			$('#g-card' + id)
			.attr('data-id', data.id)
			.find('.hobbys')
			.addClass('show')
			.find('span')
			.html(data.hobby);
			$('#g-card' + id).find('.ns-photo').html(data.name);
	},
	displayHobbys : function (flag){
		switch(flag){
			case "show":
				$('.hobbys').addClass('show');
			break;
			case "hide":
			    $('.hobbys').removeClass('show').removeClass('keep');
			break;
			case "keep":
				var arr=[0,1,2,3,4,5,6,7];
				arr=this.spliceArrGroup(arr,4);
				$.each(arr,function(index,val){
					$('#g-card'+val+' .hobbys').addClass('keep');
				});
				$('.hobbys').not(".keep").removeClass('show');
			break;
		}
	},
	displayGiftsNum : function (num) {
		$('#gift-num-display span').html(num);
	},
	updateGiftsNum : function (delta) {
		var delta = delta || 0;
		this.giftsNum += delta;
		this.displayGiftsNum(this.giftsNum);
	},
	displayNsNum : function (num) {
		$('#ns-num-display span').html(num);
	},
	updateNsNum : function (delta) {
		var delta = delta || 0;
		this.nsWinNum += delta;
		this.displayNsNum(this.nsWinNum);
	},
	displayGift : function () {
		var gift = this.spliceArrGroup(this.giftsSelectedData,1),	
		giftName = gift.name,bgLeft; //随机得到一条展示数据
		this.curShowGift=gift; //将当前礼物存入curShowGift
		
		this.updateGiftsNum(-1); //礼物数目减一
		this.curGiftIds = gift.ids; //保存正确答案
		bgLeft=-50*(gift.position-1);
		$('#gift-card .gift-photo').css('background-position',bgLeft+'px top');
		$('#gift-card .desc span').html(giftName); //gift显示礼物名称
		this.openGift();
		this.delayExec(0,function(){
			this.showGiftName();
		});
	},
	selectNs : function (){
		var _this = this,
		nsOption = $('.ns-girl-card'),
		id;
		nsOption.on('mousedown',function (e){
			e.preventDefault();
			id = parseInt($(this).attr('data-id'));
		}).on('mouseup', function (e){
		    e.preventDefault();
			if ($.inArray(id, _this.curGiftIds) > -1) { //选择正确,显示唇印并更换NS
				_this.lastingHits+=1;
				_this.correct($(this),id);
				_this.addNewNs($(this)); 		//新增一位NS.	
			} else { //选择错误
				if(_this.giftsNum==0){
				    _this.gameOver();
					return;
				};
				_this.lastingHits=0;
				_this.wrong($(this));
				_this.addNewNs(_this.replaceDom,true); //替换一位NS.	
			}
			nsOption.off('mouseenter mouseup');
			_this.addNsCard(_this);
			_this.newRound();
		});
	},
	addNsCard:function(game){
		if(game.nsSetedNum>=8) return;
		var id=game.nsSetedNum;
		game.nsSetKeepTime+=1;
		if(id==2&&game.nsSetKeepTime==1||id==3&&game.nsSetKeepTime==2||id>3&&game.nsSetKeepTime==2){
			game.nsSetKeepTime=0;
			game.nsSetedNum+=1;	
			game.addNewNs($('#g-card' + id),true);
		}
	},
	newRound : function (){
		this.delayExec(1,function(){
			this.showGiftName('hide');
			this.displayHobbys('show');
			this.openGift(true);
		});
		if(this.nsSetedNum>=2&&this.nsSetedNum<=4){
			this.count(3);
		}else{
			this.count(8);
		}
		
		
		this.delayExec(0,function(){
			if(!this.bonuOfKeep){
				this.displayHobbys('hide');
			}else{
				this.displayHobbys('keep');
				this.bonuOfKeep=0;
			}
		});
		this.delayExec(0,function(){ 	
			$('#gift-card .count').hide();
			this.displayGift();
			this.selectNs();
		});
	},
	correct : function (dom,id){
		var _this=this;
		dom.find('.show-result').removeClass('break').addClass('right show');
		
		//1.j将选对的NS移出nsSelectedData
		$.each(_this.nsSelectedData,function(index,value){
			if(value.id==id){
				var ns=_this.nsSelectedData.splice(index,1);  //将NS的数据从当前展示的女神数据中移出，重新回库
			}
		});
		
		this.delayExec(2,function(){
			this.updateNsNum(1); //正确。获得一个NS.
		});	
		//判断连中记录
		if(this.lastingHits==3){
			this.lastingHits=0; //清空记录
			this.bonus('tips');
		}
		
		//判断是否有礼物彩蛋
		var bonu_g_index=$.inArray(id,this.nsBonuIds);
		
		if(bonu_g_index>-1){ //中了彩蛋
			this.curGiftIds.splice(bonu_g_index,1);
			this.nsBonuIds.splice(bonu_g_index,1);
			//中了彩蛋后的反应
			this.bonus('gift');
		}
		
		this.delayExec(0,function(){
			dom.find('.show-result').removeClass('show');	
		});
		
		if (this.nsData.length == 0) { //如果已经没有后备NS

		}
	},
	bonus:function(type){
	    var _this=this;
		switch(type){
			case "tips": //三连中，下轮三位保留提示
			 var awords='不错哦！居然三连中！！奖励保留提示一轮~';
			 this.bonuOfKeep=1;
			 showBonus('tips',awords,2);
			break;
			case "gift":  //女神回送礼物
				var awords='厉害哦！女神夸你聪明又有心！！回赠礼物一枚~';	
				 showBonus('gift',awords,4);
			break;
		}
		
		function showBonus(type,awords,time){
			var gift_card_top=$('#gift-card').offset().top+9;
			$('#bonu').css({top:gift_card_top}).show().find('span').html(awords);
			_this.delayExec(time,function(){
				$('#bonu').hide();
			});
			if(type=='gift'){
				showGiftAdd(gift_card_top);
			}
		}
		
		function showGiftAdd(bonuTop){
			var targetPos=$('#gift-num-display span').offset();
			targetPos.top=targetPos.top-bonuTop;
		
			$('#gift-bonus').addClass('animate').css({top:targetPos.top,left:targetPos.left,opacity:1});
			setTimeout(function(){
				$('#gift-bonus').removeClass('animate').css({opacity:0,top:0,left:'50%'});
				 _this.giftsNum+=1;
				  _this.displayGiftsNum( _this.giftsNum);
			},1000);
		}
	},
	wrong : function (dom){  //送错礼物
	
		var _this=this,id=this.curGiftIds.pop(),rightCard=$('.ns-girl-card').filter('[data-id="'+id+'"]'),curGift=this.curShowGift;   //得到应该送的女神 
		this.replaceDom=rightCard; 
		
		//1.j将NS放回到库中
		$.each(_this.nsSelectedData,function(index,value){
			if(value.id==id){
				var ns=_this.nsSelectedData.splice(index,1)[0];  //将NS的数据从当前展示的女神数据中移出，重新回库
				_this.nsData.push(ns);
			}
		});
		//2.将GIFT放回库中
		this.giftsData.push(curGift);
		
		dom.find('.show-result').removeClass('right break').addClass('show');
		rightCard.find('.show-result').addClass('show break');
		
		this.delayExec(3,function(){ 	
			dom.find('.show-result').removeClass('show');
			rightCard.find('.show-result').removeClass('show');
		});
	},
	gameOver:function(){
		//展示成绩
		var girls_num=this.nsWinNum,resultData=this.resultsData;
		$('#show-results .hearts span').html(girls_num);
		$.each(resultData,function(key,val){
			if(typeof(val['scores'])=="number"){ //数字
				if(key==girls_num){
				    $('#show-results .conclusion').html(val['remark']);
					return false;
				};
			}else{ //数组
				if(girls_num>=val['scores'][0]&&girls_num<=val['scores'][1]){
					 $('#show-results .conclusion').html(val['remark']);
					return false;
				};	
			}
			return;
		});
		$('#show-results').show();
	},
	addNewNs : function (dom,dataOnly) { //新增一位NS dataOnly:只增加数据，giftNum不增加
		//需要考虑一种情况，即已经没有候补NS。
		if (this.nsData.length == 0) {
			this.addNewGift();
			return;
		};	
		//从库里选择一位NS
		var newNs = this.spliceArrGroup(this.nsData,1),
		id = newNs.id;
		if(newNs.bonus){
			this.nsBonuIds.push(id);
		};
		this.nsSelectedData.push(newNs);
		
		//将NS展示出来
		this.delayExec(0,function(){
		    dom.find('.g-card-inner').css('background-position','-'+50*id+'px top');
			dom.attr('data-id', newNs.id);
			dom.find('.hobbys span').html(newNs.hobby);

			dom.find('.ns-photo').html(newNs.name);
		});
		//新增一份礼物
		if(!dataOnly){ 
		this.addNewGift(id);
		}else{  //如果只增加数据
			this.addNewGift(id,true); 
		}
		
	},
	addNewGift : function (id,giftNumInc){ //giftNumInc是否增加giftsNum
		var _this = this,
		giftsData = this.giftsData,
		eqArr = [],
		temp;
		if (!id) { //没有id，说明ns候补以用完。礼物则随便发
			temp = _this.spliceArrGroup(_this.giftsData,1);
		} else {
			$.each(giftsData, function (eq,val) { //val是一条gift数据。需要查找id是否在ids中
				var ids = val.ids;
				if ($.inArray(id, ids) > -1) {
					eqArr.push(eq);
				};
			});

			if (eqArr.length == 1) { //此NS只对应了一个gift
				temp = _this.giftsData.splice(eqArr[0], 1)[0];
			} else if (eqArr.length > 1) {  //此NS只对应了多个gift
				temp = _this.spliceArrGroup(_this.giftsData, 1);
			} else { 	//没有找到对应的礼物，则随便拿一份礼物   ----！！改，这不合理
				temp = _this.giftsData.pop();
			};
		};
		
		this.giftsSelectedData.push(temp);
		
		if(!giftNumInc){
			this.updateGiftsNum(1);	 //礼物数目增加一个
		}
	},
	count : function (senconds) {
		this.delayExec(senconds, function (count) {
			if (count > 0 && count <= senconds) {
				$('#gift-card .count').show().html(count);
			} else if (count == 0) {
				$('#gift-card .count').html('go');
			} 
		}, 'each');
	},
	showGiftName:function(flag){
	    if(flag=='hide'){
			$('#gift-card .desc').find('span').html("");
			$('#gift-card .desc').removeClass('show');
			return;
		}
		$('#gift-card .desc').addClass('show');
	},
	openGift : function (reverse) {
		$('#gift-canvas').removeClass('bg');
		
		var canvas = $('#gift-canvas')[0],
		ctx = canvas.getContext('2d');

		function drawTrig(x) {
			ctx.clearRect(0, 0, 100, 100);
			var grd = ctx.createLinearGradient(x, x, x / 2, x / 2);
			grd.addColorStop(0, "#92B6D5");
			grd.addColorStop(.8, "#F1F8FC");
			grd.addColorStop(1, "#41729F");
			/*背景*/
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(51,0);
			ctx.lineTo(51,51);
			ctx.lineTo(0,51);
			ctx.lineTo(0, x);
			ctx.closePath();
			ctx.fillStyle = '#749bbe';
			ctx.fill();
			/*卷起效果*/
			var grd_shadow = ctx.createLinearGradient(x, x, x / 2, x / 2);
			grd_shadow.addColorStop(.4, 'rgba(23, 71, 116, 0)');
			grd_shadow.addColorStop(1, 'rgba(23, 71, 116, .6)');
			ctx.beginPath();
			ctx.moveTo(0, 2 * x);
			ctx.lineTo(2 * x, 0);
			ctx.lineTo(x, 0);
			ctx.lineTo(0, x);
			ctx.closePath();
			ctx.fillStyle = grd_shadow;
			ctx.fill();
			/*三角*/
			ctx.beginPath();
			ctx.moveTo(0, x);
			ctx.lineTo(x, 0);
			ctx.lineTo(x, x);
			ctx.closePath();
			ctx.fillStyle = grd;
			ctx.fill();
		};

		function trigMove(startPos,rev) {
			var start = startPos || 0;
			var trigAnimate = function () {
			if(rev){
				if (start<0)
					return;
					start -= 4;
			}else{
					if (start > 100)
					return;
					start += 4;
			}	
				drawTrig(start);
				setTimeout(arguments.callee, 40);
			}
			();
		};
		if(reverse){
			trigMove(100,true); //蒙上遮罩
		}else{
			trigMove(); //撕下遮罩
		}
		
	},
	delayExec : function (num, callback, exeTime) { //同步延时执行函数;VIP中P
		var _this = this,
		exeTimer;
		if (exeTime == 'each') {
			exeTimer = true;
		}else{
			exeTimer = false;
		}; //1.记录执行模式。each：每次执行；默认：延时结束时执行
		if (!this.queues) {
			this.queues = [];
		}; //2.构建队列
		this.queues.push([num, callback, exeTimer]);

		var index_id = this.queues.length; //3.为执行函数编号排列。按照推入queues的顺序产生序列

		var countTime = num,
		callback = callback;
		var count = function (){	
			if (index_id != 1)
				return; //4.判断是否该执行;index_id!=1表示不该现在执行
				
			if (countTime >=0){	
				if (exeTimer) { //如果每秒执行
					callback.call(_this, countTime);
				} else { //如果是延时后执行
					if (countTime == 0){
							callback.call(_this, countTime);
					}
				}
				countTime -= 1;
				if (countTime == 0){
				setTimeout(arguments.callee,0); //立马执行下一个函数 
				}else{
				setTimeout(arguments.callee, 1000); //5.通过迭代实现定时功能
				}
				
			} else {  //countTime==0
				_this.queues.shift();
				if (_this.queues.length <= 0)
					return;
				countTime = _this.queues[0][0];
				callback = _this.queues[0][1];
				exeTimer = _this.queues[0][2];
				arguments.callee();
			}
		};
		count.apply(this);
		return this;
	},
	beginTips:function(){
		var html='<div class="warm-tips"><div class="warm-tips-inner"><p>游戏马上开始了，准备好了吗？</p><p class="warm-tips-count"></p></div></div>';
		$('body').append(html);
		this.delayExec(5,function(count){
		    if(count==0) count='GAME START!';
			$('.warm-tips-count').html(count);
		},'each').delayExec(2,function(){
			$('.warm-tips').remove();
		});
	},
	start : function () { 	
		this.selectNsData(this.nsSetedNum);
		this.selectGiftsData();
		this.initNsBox();
		this.beginTips();
		this.count(3);
		this.delayExec(0,function (){
			$('.hobbys').removeClass('show');
		}).
		delayExec(0,function(){
			$('#gift-card .count').hide();
			this.displayGift();
			this.selectNs();
		});
	}
};

//game.start();



