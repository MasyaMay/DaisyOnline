GoodsManager = function(goodsTableName)
{
	this.GoodsTableStore=Backendless.Data.of(goodsTableName);
}

GoodsManager.prototype.Load=function(priceType, goodType, goodSubtype, addFunc)
{
	return new Promise((resolve,reject)=>{
		var flag=false;
		var whereClause="";
		if(priceType!='all')
		{
			whereClause+="PriceType=\'"+priceType+"\'";
			flag=true;
		}
		if(goodType!='all')
		{
			if(flag)
				whereClause+="AND ";
			whereClause+="Type=\'"+goodType+"\' ";
			flag=true;
		}
		if(goodSubtype!='all')
		{
			if(flag)
				whereClause+="AND ";
			whereClause+="Subtype=\'"+goodSubtype+"\'";
		}
		var queryBuilder=Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
		this.GoodsTableStore.find(queryBuilder).then(function(goods){
			var out = '';
			var goodsItems='';
			for (var key in goods){
				goodsItems=$('<div>',{
					class:'goods_item'
				}).append($('<img>',{
					src: goods[key].Image,
					alt: 'good',
					class: 'goods_item_img'
				})).append($('<p>',{
					class:'goods_item_title'
				}).append(goods[key].Name)).append($('<p>',{
					class:'goods_item_subtitle'
				}).append(goods[key].Cost+' РУБ.'));

				var addButton=$('<button>',{
					class:'btn goods_item_btn'
				});
				addButton.append($('<i>',{
					class:'icon-bag'
				})).append('Добавить в корзину');

				var showButton=$('<button>',{
					class:'btn goods_item_btn'
				}).append('Подробнее');

				addButton.on('click', goods[key].Articul, addFunc);
				showButton.on('click',goods[key].Articul, function(event){$(location).attr('href','info.html?articul='+event.data);});
				goodsItems.append(addButton).append(showButton);
				$('#good').append(goodsItems);
			}
			resolve();
		}.bind(this));
	})	
} 

GoodsManager.prototype.ShowGoodInfo=function(articul, divId, addFunc)
{
	var queryBuilder=Backendless.DataQueryBuilder.create().setWhereClause('Articul='+articul);
	this.GoodsTableStore.find(queryBuilder).then(function(good){
		cartItemDiv=$('<div>',{
			class: 'cart_item cart_item_info_block',
		}).append($('<img>',{
			src: good[0].Image,
			alt: 'good',
			class: 'goods_item_img  goods_item_info_img'
		}));

		var goodInfo=$('<p>',{
			class: 'cart_item_info_description'
		}).append(good[0].Info);

		var addButton=$('<button>',{
			class:'btn goods_item_btn'
		});

		var cartItemInfo=$('<div>',{
			class:'cart_item_info'
		}).append($('<p>',{
			class:'cart_item_info_title',
		}).append(good[0].Name)).append($('<p>',{
			class: 'cart_item_info_articul'
		}).append('арт.' + good[0].Articul)).append(goodInfo).append(addButton);

		var cartItemPrice=$('<div>',{
			class: 'cart_item_price cost'
		}).append(good[0].Cost + ' p.');

		addButton.append($('<i>',{
			class:'icon-bag'
		})).append('Добавить в корзину');

		addButton.on('click', good[0].Articul, addFunc);
		cartItemDiv.append(cartItemInfo).append(cartItemPrice);
		$('#'+divId).append(cartItemDiv);
	});
}
