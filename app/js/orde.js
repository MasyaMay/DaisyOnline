const $orde_fio = document.getElementById('orde_fio');
const $orde_adress = document.getElementById('orde_adress');
const $orde_flat = document.getElementById('orde_flat');
const $orde_index = document.getElementById('orde_index');
const $orde_city = document.getElementById('orde_city');
const $orde_numder = document.getElementById('orde_numder');

const $orde_btn = document.getElementById('orde_btn');
const OrdeTableStore = Backendless.Data.of('Orde');
var _flag = false;

$orde_btn.addEventListener('click', createOrde);

function createOrde() {
  var flag = false;
  if(!($orde_fio.value == '' || $orde_adress.value == '' || $orde_flat.value == '' || $orde_index.value == '' || $orde_city.value == '')){
    OrdeTableStore.save({
      FIO: $orde_fio.value,
      Adress: $orde_adress.value,
      Flat: $orde_flat.value,
      Index: $orde_index.value,
      City: $orde_city.value,
      Numder: $orde_numder.value
    }).then(function(data){
        $('#orde').html('<div class="orde_block_title">Спасибо за заказ!</div>');
      });
    flag = true;
  }
  if(!flag){
    if(!_flag){
      $('.orde_block').append('<p id="error">Заполните все поля</p>');
      _flag = true;
    }
  }
}
