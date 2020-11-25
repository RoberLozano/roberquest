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

  /** Escala un valor x entre m1 y M1 a otro valor entre m2 y M2
 *  x [m1,M1]->[m2,M2]
 * @param {Number} x 
 * @param {Number} m1 
 * @param {Number} M1 
 * @param {Number} m2 
 * @param {Number} M2 
 */
function escalar(x, m1, M1, m2, M2) {
  let d1 = M1 - m1;
  let d2 = M2 - m2;
  return (x - m1) * (d2 / d1) + m2;
}

// acts like Array##splice for parent's childNodes
function spliceChildNodes(parent, start, deleteCount /*[, newNode1, newNode2]*/) {
	var childNodes = parent.childNodes;
	var removedNodes = [];

	// If `start` is negative, begin that many nodes from the end
	start = start < 0 ? childNodes.length + start : start

	// remove the element at index `start` `deleteCount` times
	var stop = typeof deleteCount === 'number' ? start + deleteCount : childNodes.length;
	for (var i = start; i < stop && childNodes[start]; i++) {
		removedNodes.push(parent.removeChild(childNodes[start]));
	}

	// add new nodes at index `start`
	if (arguments.length > 3) {
		var newNodes = [].slice.call(arguments, 3);

		// stick nodes in a document fragment
		var docFrag = document.createDocumentFragment();
		newNodes.forEach(function(el) {
			docFrag.appendChild(el);
		});

		// place in `parent` at index `start`
		parent.insertBefore(docFrag, childNodes[start]);
	}

	return removedNodes;
}