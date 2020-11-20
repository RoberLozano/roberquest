function roundTo(precision, num) {
    //redondeamos a gramos  
    return +(Math.round(num + "e+" + precision) + "e-" + precision);
  }

  function isNumber(value) {
    if (value instanceof Number)
      return true
    else
      return !isNaN(value);
  }
  
  function ls(nombre, valor) {
    // body...
    if(valor){
      localStorage.setItem(nombre,JSON.stringify(valor) )
    }
    else{
      return JSON.parse(localStorage.getItem(nombre))
    }
  }
  
  