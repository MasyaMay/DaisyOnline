var goodsManager=new GoodsManager('Goods');



$('document').ready(function(){
    var priceType=GetKey('price-type');
    if(priceType==false)
        priceType='sale';
    var goodType=GetKey('good-type');
    if(goodType==false)
        goodType='all';
    var goodSubtype=GetKey('good-subtype');
    if(goodSubtype==false)
        goodSubtype='all';

    goodsManager.Load(priceType,goodType,goodSubtype, 
        (event)=>
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