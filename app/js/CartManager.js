CartManager=function(cookieName, cartTableName, goodsTableName)
{
	this.CartTableStore = Backendless.Data.of(cartTableName);
	this.GoodsTableStore = Backendless.Data.of(goodsTableName);
	this.OrdeTableStore = Backendless.Data.of('Orde');
	this.cart={};
	this.cookieName=cookieName;
	this.goods={};
}

CartManager.prototype.CheckCart=function()
{
	var _this=this;
	return new Promise((resolve, reject)=>
	{
		if($.cookie(_this.cookieName)){
        var whereClause = "AccountID = \'" + $.cookie('user') +"\'";
        var queryBuilder=Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        _this.CartTableStore.find(queryBuilder).then(function(userCart)
        {
            if(userCart.length!=0)
            {
                for(var itemIndex in userCart)
                {
                    _this.cart[userCart[itemIndex].GoodArticul]=userCart[itemIndex].Count;
                }
	            whereClause="";
	            var firstTime=true;
	            for(var key in _this.cart)
	            {
	                if(firstTime)
	                {
	                    whereClause+="Articul="+key;
	                    firstTime=false;
	                }
	                else
	                    whereClause+=" OR Articul="+key;
	            }
	            queryBuilder=Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
	            _this.GoodsTableStore.find(queryBuilder).then(function(data){
	                for(var i=0;i<data.length;i++)
	                {
	                    _this.goods[data[i].Articul]={
	                        Name: data[i].Name,
	                        Image: data[i].Image,
	                        Cost: data[i].Cost,
	                        Count: _this.cart[data[i].Articul],
	                        Articul: data[i].Articul,
	                        Discount: data[i].Discount
	                    }
	                }
	                resolve();
	            });
        	}
        	else resolve();
        });
    	}else reject();
	})
}

CartManager.prototype.SetMiniCart=function(miniCartId)
{
	var out = 0;
    for (var key in this.cart){
        out += this.cart[key];
    }
    if(out != 0){
        $('#'+miniCartId).html('<a href="cart.html"><i class="icon-shopping-cart"></i><span id="out">' + out + '</span></a>');
    }else $('#'+miniCartId).html('<a href="cart.html"><i class="icon-shopping-cart"></i></a>');
}

CartManager.prototype.AddToCart=function(articul)
{
	var _this=this;
	return new Promise((resolve,reject)=>{
	var flag = false;
    if($.cookie(_this.cookieName)){         
        //добавляем товар в корзину
        var whereClause = "AccountID = \'" + $.cookie(_this.cookieName) +"\' AND GoodArticul = "+articul;
        var queryBuilder=Backendless.DataQueryBuilder.create().setWhereClause(whereClause);

        _this.CartTableStore.find(queryBuilder).then(function(data)
        {
            if(data.length!=0)
            {
                data[0].Count++;
                _this.CartTableStore.save(data[0]);
            }else {
                var cartItem={
                    AccountID: $.cookie(_this.cookieName),
                    GoodArticul: Number(articul),
                    Count: 1
                }
                _this.CartTableStore.save(cartItem);
            }

            if (_this.cart[articul]!=undefined) {
                _this.cart[articul]++;
            }
            else {
                _this.cart[articul] = 1;
            }
            resolve();
        });       
    }
    else reject();
	});
}

CartManager.prototype.SaveGood=function(articul)
{
	var _this=this;
	return new Promise((resolve, reject)=>{
		var whereClause = "AccountID = \'" + $.cookie(_this.cookieName) +"\' AND GoodArticul = "+articul;
        var queryBuilder=Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
        _this.CartTableStore.find(queryBuilder).then(function(data)
        {
                if(_this.goods[articul].Count==0)
                {
                    _this.CartTableStore.remove(data[0]);
                    delete _this.cart[articul];
                    delete _this.goods[articul];
                }
                else
                {
                    data[0].Count=_this.goods[articul].Count;
                    _this.CartTableStore.save(data[0]);
                }
                resolve();
        });
	});
}

CartManager.prototype.PlusGoods=function(articul)
{
	var _this=this;
    this.cart[articul.data]++;
    this.goods[articul.data].Count++;
    this.SaveGood(articul.data).then(()=>{
    	_this.SetMiniCart('mini-cart');
    	_this.SetCart('my-cart');
    });
}

CartManager.prototype.MinusGoods=function(articul){
	var _this=this;
	this.cart[articul.data]--;
	this.goods[articul.data].Count--;
	this.SaveGood(articul.data).then(()=>{
		_this.SetMiniCart('mini-cart');
    	_this.SetCart('my-cart');
    });
}

CartManager.prototype.DeleteGoods=function(articul) {
	var _this=this;
	this.cart[articul.data]=0;
	this.goods[articul.data].Count=0;
	this.SaveGood(articul.data).then(()=>{
		  _this.SetMiniCart('mini-cart');
    	   _this.SetCart('my-cart');
    });
}

CartManager.prototype.Clear=function()
{
    var _this=this;
    var promises=[];
    for(var key in this.cart)
    {
        this.cart[key]=0;
        this.goods[key].Count=0;
        promises.push(this.SaveGood(key));
    }
    Promise.all(promises).then(()=>{
        _this.cart={};
        _this.goods={};
        _this.SetMiniCart('mini-cart');
        _this.SetCart('my-cart');
    });
}

CartManager.prototype.SetCart=function(cartId)
{
	$('#'+cartId).html("");
	console.log($.isEmptyObject(this.cart));
	$('.cart_total_title').html('Итого: 0 РУБ.');
	if ($.isEmptyObject(this.cart)) {
            $('#'+cartId).append('Корзина пуста. Добавьте товар в корзину');
        }
        else {
        	var total=0;
        	var cartItemDiv='Корзина пуста. Добавьте товар в корзину';
        	if(!$.isEmptyObject(this.goods))
        	{
        		for (var key in this.goods) {      		
        			total = this.goods[key].Count * this.goods[key].Cost + total;

        			cartItemDiv=$('<div>',{
        				class: 'cart_item',
        			}).append($('<img>',{
        				src: this.goods[key].Image,
        				alt: 'good',
        				class: 'cart_item_img'
        			}));

        			var cartItemInfo=$('<div>',{
        				class:'cart_item_info'
        			}).append($('<p>',{
        				class:'cart_item_info_title',
        			}).append(this.goods[key].Name)).append($('<p>',{
        				class: 'cart_item_info_articul'
        			}).append('арт.' + this.goods[key].Articul));

        			var deleteButton=$('<p>',{
        				class: 'cart_item_info_del'
        			}).append('удалить');
        			deleteButton.on('click',this.goods[key].Articul, this.DeleteGoods.bind(this));
        			cartItemInfo.append(deleteButton);

        			var cartItemPrice=$('<div>',{
        				class: 'cart_item_price'
        			});

        			var minusButton = $('<button>',{
        				class:'cart_item_price_btn cart_item_price_btn_minus'
        			}).append('-');
        			minusButton.on('click',this.goods[key].Articul, this.MinusGoods.bind(this));

        			var plusButton = $('<button>',{
        				class:'cart_item_price_btn'
        			}).append('+');
        			plusButton.on('click',this.goods[key].Articul, this.PlusGoods.bind(this));

        			cartItemPrice.append(minusButton).append(this.goods[key].Count).append(plusButton).append($('<p>'+this.goods[key].Count + ' * ' + this.goods[key].Cost + ' = ' + this.goods[key].Count * this.goods[key].Cost +' РУБ.</p>',{
        				class: 'cart_item_price_total'
        			}))
        			cartItemDiv.append(cartItemInfo).append(cartItemPrice);
        			$('#'+cartId).append(cartItemDiv);
        		}    		
        	}
        	$('.cart_total_title').html('Итого: ' + total + ' РУБ.');
            if(total != 0){
                    $('#show').on('click', function(){
                    $('#orde').css('display', 'block');
                    $('#show').css('display', 'none');
                    $('#orde_btn').on('click', function(){
                    	this.firstTime=true;
                    	const $orde_fio = document.getElementById('orde_fio');
						const $orde_adress = document.getElementById('orde_adress');
						const $orde_flat = document.getElementById('orde_flat');
						const $orde_index = document.getElementById('orde_index');
						const $orde_city = document.getElementById('orde_city');
						const $orde_numder = document.getElementById('orde_numder');

						var flag = false;
						if(!($orde_fio.value == '' || $orde_adress.value == '' || $orde_flat.value == '' || $orde_index.value == '' || $orde_city.value == '')){
							this.OrdeTableStore.save({
								FIO: $orde_fio.value,
								Adress: $orde_adress.value,
								Flat: $orde_flat.value,
								Index: $orde_index.value,
								City: $orde_city.value,
								Numder: $orde_numder.value
							}).then(function(data){
								$('#orde').html('<div class="orde_block_title">Спасибо за заказ!</div>');
								this.Clear();
							}.bind(this));
							flag = true;
						}
						if(!flag){
							if(this.firstTime){
								$('.orde_block').append('<p id="error">Заполните все поля</p>');
								this.firstTime = false;
							}
						}
                    }.bind(this));
                }.bind(this))
            }
        }
}




