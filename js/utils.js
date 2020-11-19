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
  