const $indexName = document.getElementById('indexName');
const $indexEmail = document.getElementById('indexEmail');

const $btnEmail = document.getElementById('btnEmail');
const EmailTableStore = Backendless.Data.of('Email');
var _flag = false;

$btnEmail.addEventListener('click', createEmail);

function createEmail() {
  var flag = false;
  if(!($indexEmail.value == '')){
    EmailTableStore.save({
      Name: $indexName.value,
      Email: $indexEmail.value
    }).then(function(data){
        $('.email_block').html('<p>Спасибо за подписку!</p>');
      });
    flag = true;
  }
  if(!flag){
    if(!_flag){
      $('.email_block').append('<p id="error">Заполните все поля</p>');
      _flag = true;
    }
  }
}
