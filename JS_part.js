function request()
{
    search.value=1;
}

function find(){
    if(event.keycode===13)
    search.value=2;
}

function getChar(event) {

    if (event.which != 0 && event.charCode != 0) { 
      if (event.which < 32) return null; 
      return String.fromCharCode(event.which);
    }
  
    return null;
  }

  function searchKeyPress(e)
  {
      if (e.keyCode == 13)
      {
          search.value=2;
          return false;
      }
      return true;
  }

var search = document.createElement('input');
var sbutton=document.createElement('div');
sbutton.addEventListener('click',request);
sbutton.id='btn_s';
var div =document.createElement('div');
div.id='searchDiv';
search.type='search';
div.appendChild(search);
div.appendChild(sbutton);
document.body.appendChild(div);
document.body.addEventListener('keypress',find);
search.onkeydown=function(event){return searchKeyPress(event);};



