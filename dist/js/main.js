var cartManager=new CartManager('user','Cart','Goods');
const DaisyTableStore = Backendless.Data.of('DaisyTable');
const CartTableStore = Backendless.Data.of('Cart');
const GoodsTableStore = Backendless.Data.of('Goods');
var flag = false;

$('document').ready(function(){
	if($.cookie('user')){
		$('#mini-user').html('<a href="profile.html"><i class="icon-vcard"></i></a>');
		cartManager.CheckCart().then(function(){
			cartManager.SetMiniCart('mini-cart');});
	}

	$('#menu_mobile').on('click', function(){
	  	console.log('вошел');
		if(!flag){
			$('.menu').css('display', 'block');
			flag = true;
		} else {
			$('.menu').css('display', 'none');
			flag = false;    
		}
	});
	
});

function Welcome(){
    var url = "profile.html";
    $(location).attr('href',url);
} 





