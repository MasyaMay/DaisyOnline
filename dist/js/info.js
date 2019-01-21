var goodsManager=new GoodsManager('Goods');

$('document').ready(function(){
	var articul=GetKey('articul');
	goodsManager.ShowGoodInfo(articul,'info',(event)=>
        {
        cartManager.AddToCart(event.data)
        .then(
            ()=>{
                cartManager.SetMiniCart('mini-cart')
            },
            ()=>{$(location).attr('href',"login.html");})
        });
});

function GetKey(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : false;
}