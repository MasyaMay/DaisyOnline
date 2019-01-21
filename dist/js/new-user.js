const $inputFamily = document.getElementById('inputFamily');
const $inputName = document.getElementById('inputName');
const $inputNumber = document.getElementById('inputNumber');
const $entranceLogin = document.getElementById('inputLogin');
const $entrancePassword = document.getElementById('inputPassword');
const $updateBtn = document.getElementById('update-btn');

$updateBtn.addEventListener('click', createUser);

function createUser() {
  if(!($entranceLogin.value == '' || $entrancePassword.value == '' || $inputName.value == '')){
    var whereClause = "Login = \'" + $entranceLogin.value +"\'";
    var queryBuilder=Backendless.DataQueryBuilder.create().setWhereClause(whereClause);
    DaisyTableStore.find(queryBuilder).then((data)=>{
      if(data.length==0)
      {
        $('#login-form').html('<strong>Выполняется регистрация...</strong>');
        DaisyTableStore.save({
          family: $inputFamily.value,
          name: $inputName.value,
          number: $inputNumber.value,
          login: $entranceLogin.value,
          password: $entrancePassword.value
        }).then(function(data){
          $.cookie('user', data.objectId, { expires: 1 });    
          Welcome();
        }); 
      }else{
        if(!_flag){
          $('#form_new_user').prepend('<p id="error">Пользователь уже зарегестрирован</p>');
          _flag = true;
        }
      }
    })    
  } else 
    if(!_flag){
      $('#form_new_user').prepend('<p id="error">Заполните все поля</p>');
      _flag = true;
    }
}