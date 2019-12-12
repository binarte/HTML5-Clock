var TTDATE = new Date();
TTDATE.setUTCFullYear(2000);
TTDATE.setUTCMonth(0);
TTDATE.setUTCDate(1);
TTDATE.setUTCHours(12);
TTDATE.setUTCMinutes(0);
TTDATE.setUTCSeconds(0);
TTDATE.setUTCMilliseconds(0);

var EINC = (23.44 * Math.PI) / 180;
var EINCSIN = Math.sin(EINC);

var ST = (-0.83 * Math.PI) / 180;
var STSIN = Math.sin(ST);

var ST_DAYNIGHT = 0;
var ST_DAY  = 1;
var ST_NIGHT  = 2;


function calcSunRiseSet(){
	var date = new Date();	
	var n = Math.floor((date.getTime() - TTDATE.getTime())/86400000);
	n += 0.0008;
	
	var long = 0, lat = 0, alt = 0;
	if (coords && coords.longitude) {
		long = coords.longitude;		
	}
	if (coords && coords.latitude) {
		lat = coords.latitude;
		//lat = -70;
	}
	if (coords && coords.altitude) {
		alt = coords.altitude;
	}
	
	var loRad = (long * Math.PI) / 180;
	var laRad = (lat * Math.PI) / 180;
	
	var J = n - (long / 360);
	var M = (357.5281 + (0.98560028 * J)) % 360;
	var Mrad = (M * Math.PI) /180;
	var C = (1.9148 * Math.sin(Mrad)) + (0.02 * Math.sin(2*Mrad)) + (0.0003 * Math.sin(3*Mrad));
	var L = (M + C + 180 + 102.9372) % 360;
	var Lrad = (L * Math.PI) /180;
	var Jt = 2451545.0 + J + (Math.sin(Mrad) * 0.0053) - (Math.sin(2 * Lrad) * 0.0069); 
	var sinT = Math.sin(Lrad) * EINCSIN;
	var Trad = Math.asin(sinT);
	
	var cosW = (STSIN - (Math.sin(laRad) * sinT) ) / (Math.cos(laRad) * Math.cos(Trad) );
	if (cosW > 1) {
		return {
			'state' : ST_NIGHT
		}
	} else if (cosW < -1) {
		return {
			'state' : ST_DAY
		}
	}
	var W = (Math.acos(cosW) * 180) / Math.PI;
	
	
	var Jrise = Jt - (W / 360);
	var Jset = Jt + (W / 360);
	
	var TSrise = ((Jrise - 2451545) * 86400000) + TTDATE.getTime();
	var TSset = ((Jset - 2451545) * 86400000) + TTDATE.getTime();
	
	var Drise = new Date();
	var Dset = new Date();
	Drise.setTime(TSrise);
	Dset.setTime(TSset);
	
	
	return {
		"state": ST_DAYNIGHT,
		"rise" : Drise,
		"set"  : Dset
	};
	
}

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
