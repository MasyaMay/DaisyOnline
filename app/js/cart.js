var cartManager = new CartManager('user','Cart','Goods');
cartManager.CheckCart().then(
	()=>{cartManager.SetMiniCart('mini-cart');cartManager.SetCart('my-cart');},
	()=>{$(location).attr('href',"login.html");});