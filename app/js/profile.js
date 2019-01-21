const $exitBtn = document.getElementById('exit-btn');


if($.cookie('user')){   //value
    DaisyTableStore.findById($.cookie('user')).then(function(key)
    {     
        $('#lastname').text(key.family);
        $('#name').text(key.name);
        $('#number').text(key.number);
        $('#login').text(key.login);
    });
  }

$exitBtn.addEventListener('click', exitUser);

function exitUser() {
 if($.removeCookie('user')) {
   $('.profile_block').html('<strong>Выход...</strong>');
    var url = "login.html";
    $(location).attr('href',url);
  }
}