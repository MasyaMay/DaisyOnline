const $entranceLogin = document.getElementById('entranceLogin');
const $entrancePassword = document.getElementById('entrancePassword');
const $entranceBtn = document.getElementById('entrance-btn');
var _flag = false;
$entranceBtn.addEventListener('click', entranceUser);

function entranceUser() {
  var flag = false;
  DaisyTableStore.find().then(function(key){
    for(var index in key) {
      if (key[index].login == $entranceLogin.value && key[index].password == $entrancePassword.value){
        $('#login-form').html('<strong>Проверка данных...</strong>');
        $.cookie('user', key[index].objectId, { expires: 1 });
        Welcome();       
      }
    }
    if(!flag){
          if(!_flag){
            $('#form').prepend('<p id="error">Неверный логин или пароль</p>');
            _flag = true;
          }
          $entranceLogin.value = '';
          $entrancePassword.value = '';
      }
  })
}