
function generatePoints(where, count, labelInterval, radius) {
	var A90 = Math.PI/2;
	
	var wofs = 50 - radius;
	var wpos = radius;
	var wpos2 = wpos;

	
	var out = [];
	var inc = (Math.PI*2) / count;
	var deg = 360 / count;
	for (var i = 0; i < count; i++){
		
		var ang = i * inc - (Math.PI/2);
		var p = document.createElementNS(SVGNS,'path');
		p.setAttribute("stroke","black");
		p.setAttribute("stroke-width","0.2");
		
		var l;
		if (i % labelInterval){
			l = radius - 1;
		} else {
			l = radius - 2;
			
			var t = document.createElementNS(SVGNS,'text');
			t.Text = document.createTextNode('');
			t.appendChild(t.Text);
			where.appendChild(t);
			
			var ang2 = ((i * deg) - 0) % 360;
			var dist = radius - 6.5;
			if (ang2 > 90 && ang2 < 270){
				ang2 += 180;
				dist += 3.5;
			}
			
			//t.setAttribute('x',50+Math.sin(curang)*44);
			//t.setAttribute('y',50-Math.cos(curang)*44);
			t.setAttribute('class','clock label');
			t.setAttribute('transform',
				'translate(' + (50+Math.sin(ang+A90)*dist) + ' ' + (50-Math.cos(ang+A90)*dist) + '), '+
				'rotate('+ ang2 + ' 0 0)'
			);
						
			out.push(t);

		}
		
		
		p.setAttribute("d","M"+(wofs+wpos+Math.cos(ang)*wpos2)+" "+(wofs+wpos+Math.sin(ang)* wpos2)+ " L"+(wofs+wpos+Math.cos(ang)*l )+" "+(wofs+wpos+Math.sin(ang)* l)+ " Z");
		
		where.appendChild(p);
	} 
	
	return out;
}

function genTemplate(numbers, func){
	var out = [];
	for (var i = 0; i < numbers.length; i++) {
		var v = numbers[i];
		if ( (typeof v) == 'number'){
			out.push(func(v));
		} else {
			out.push('' + v);
		}
	}
	return out;
}

function genTemplates(numbers){
	var out = {
		'ar' : genTemplate(numbers, function(v){return v;}),
		'rom' : genTemplate(numbers, roman),
		'roc' : genTemplate(numbers, function(v){return roman(v,true);}),
		'jazh' : genTemplate(numbers, japanese)
	};
	out.clear = [];
	for (var i = 0; i < numbers.length; i++){
		out.clear.push('');
	}
	return out;
}

function roman(num,classic){
	var singles = ['I','X','C','M'];
	var fives   = ['V','L','D'];
	
	var idx = 0;
	var out = '';
	num = Math.round(num);
	if (num > 4999){
		num = 4999;
	} else if (num < 1){
		num = 1;
	}
	while (num){
		var part = num % 10;
		var rpart = '';
		var nrom = '';
		num -= part;
		num /= 10;
				
		if (part >= 5){
			part -= 5;
			rpart = fives[idx];
			nrom = singles[idx+1];
		} else {
			nrom = fives[idx];
		}
		
		if (part == 4 && !classic){
			rpart = singles[idx] + nrom;
		} else {
			for (var i = 0; i < part; i++){
				rpart += singles[idx];
			}
		}
		
		out = rpart + out;
		idx++;
	}
	return out;
}
