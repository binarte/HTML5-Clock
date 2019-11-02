
var SVGNS = "http://www.w3.org/2000/svg";

var svg = document.getElementsByTagName('svg')[0];
var l;

var g = document.getElementById('hours');
var inc = Math.PI / 30;
var curang = 0;
var hours = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
hours = ['','','','','','','','','','','',''];
for (var i = 0; i < 60; i++){
	var p = document.createElementNS(SVGNS,'path');
	p.setAttribute("stroke","black");
	p.setAttribute("stroke-width","0.2");
	if (i % 5){
		 l = 38;
	}
	else {
		l = 36;
		
		var idx = i/5;
		var t = document.createElementNS(SVGNS,'text');
		
		var ang = (curang * 180 / Math.PI) % 360;
		var dist = 31.25;
		if (ang > 90 && ang < 270){
			ang += 180;
			dist += 3;
		}
		
		//t.setAttribute('x',50+Math.sin(curang)*44);
		//t.setAttribute('y',50-Math.cos(curang)*44);
		t.setAttribute('class','clock label');
		t.setAttribute('transform',
			'translate(' + (50+Math.sin(curang)*dist) + ' ' + (50-Math.cos(curang)*dist) + '), '+
			'rotate('+ ang + ' 0 0)'
		);
		
		t.appendChild(document.createTextNode(hours[idx]) );
		
		g.appendChild(t);
	}
	p.setAttribute("d","M"+(50+Math.sin(curang)*40 )+" "+(50+Math.cos(curang)* 40)+ " L"+(50+Math.sin(curang)*l )+" "+(50+Math.cos(curang)* l)+ " Z");
	
	g.appendChild(p);
	
	curang += inc;
}	

//g = document.getElementById('week');
inc = Math.PI / 7;
var curang = 0;
var weekDays = ['SEG','TER','QUA','QUI','SEX','SÁB','DOM'];
var weekDays = ['','','','','','',''];

var wofs = 20;
var wpos = 30;
var wpos2 = wpos - 1;
var wlen = 25;
var wdif = 2;

for (var i = 0; i < 14; i++){
	var p = document.createElementNS(SVGNS,'path');
	p.setAttribute("stroke","black");
	p.setAttribute("stroke-width","0.2");
	if (i % 2){
		l = wlen;
	}
	else {
		l = wlen + wdif;
		var idx = i/2;
		var t = document.createElementNS(SVGNS,'text');
		
		var ang = (curang * 180 / Math.PI) % 360;
		var dist = 41.25;
		if (ang > 90 && ang < 270){
			ang += 180;
			dist += 3;
		}
			//t.setAttribute('x',50+Math.sin(curang)*44);
		//t.setAttribute('y',50-Math.cos(curang)*44);
		t.setAttribute('class','clock label');
		t.setAttribute('transform',
			'translate(' + (50+Math.sin(curang)*dist) + ' ' + (50-Math.cos(curang)*dist) + '), '+
			'rotate('+ang + ' 0 0)'
		);
		
		t.appendChild(document.createTextNode(weekDays[idx]) );
		
		g.appendChild(t);
	}
	p.setAttribute("d","M"+(wofs+wpos+Math.sin(curang)*wpos2 )+" "+(wofs+wpos+Math.cos(curang)* wpos2)+ " L"+(wofs+wpos+Math.sin(curang)*l )+" "+(wofs+wpos+Math.cos(curang)* l)+ " Z");
	
	g.appendChild(p);
	
	curang += inc;
}	


var weekPointer = document.getElementById('weekPointer').transform.baseVal.getItem(1);
var hourPointer = document.getElementById('hourPointer').transform.baseVal.getItem(1);
var minutePointer = document.getElementById('minutePointer').transform.baseVal.getItem(1);
var secondPointer = document.getElementById('secondPointer').transform.baseVal.getItem(1);

var yearDisplay = document.getElementById('year').firstChild;
var yearDisplayGlow = document.getElementById('yearGlow').firstChild;
var monthDisplay = document.getElementById('month').firstChild;
var monthDisplayGlow = document.getElementById('monthGlow').firstChild;
var dayDisplay = document.getElementById('day').firstChild;
var dayDisplayGlow = document.getElementById('dayGlow').firstChild;
var zoneDisplay = document.getElementById('zone').firstChild;
var zoneDisplayGlow = document.getElementById('zoneGlow').firstChild;



var rotweek = 360 / 7;
function updateTime(){
	var time = new Date();
	var val =  time.getSeconds() + (time.getMilliseconds()/1000);
	secondPointer.setRotate(6* val ,0,0 ); 
	val = time.getMinutes() + (val/60);
	minutePointer.setRotate(6* val ,0,0 );  
	val = time.getHours() + (val/60);
	hourPointer.setRotate(30* val ,0,0 );  
	val = time.getDay() + (val/24) - 1;
	weekPointer.setRotate(val* rotweek ,0,0 ); 
	
	yearDisplay.nodeValue=
	yearDisplay.textContent=
	yearDisplay.data=	
	yearDisplayGlow.nodeValue=
	yearDisplayGlow.textContent=
	yearDisplayGlow.data=time.getFullYear();
	
	val = time.getMonth()+1;
	if (val < 10) val = String.fromCharCode(0xA0)+val;
	monthDisplay.nodeValue=
	monthDisplay.textContent=
	monthDisplay.data=
	monthDisplayGlow.nodeValue=
	monthDisplayGlow.textContent=
	monthDisplayGlow.data=val;
	
	val = time.getDate();
	if (val < 10) val = String.fromCharCode(0xA0)+val;
	dayDisplay.nodeValue=
	dayDisplay.textContent=
	dayDisplay.data=
	dayDisplayGlow.nodeValue=
	dayDisplayGlow.textContent=
	dayDisplayGlow.data=val;
	
	val = time.getTimezoneOffset();
	if (val >= 0){
		var sign = '-';
	}
	else {
		val *= -1;
		var sign = '+';
	}
	var min = val % 60;
	var hour = (val - min)/60;
	if (min < 10) min = '0' + min;
	if (hour < 10) hour = '0' + hour;
	
	
	zoneDisplay.nodeValue=
	zoneDisplay.textContent=
	zoneDisplay.data=
	zoneDisplayGlow.nodeValue=
	zoneDisplayGlow.textContent=
	zoneDisplayGlow.data= sign + hour + ':' + min;
	
}

setInterval(updateTime,1000/120);
//svg.appendChild(g);

/*
var hours = ['XII','I','II','III','IIII','V','VI','VII','VIII','VIIII','X','XI'];

g = document.createElementNS(SVGNS,'g');
inc = Math.PI / 6;
var curang = 0;
for (var i = 0; i < 12; i++){
	var p = document.createElementNS(SVGNS,'text');
	p.setAttribute("font-family","arial,verdana,sans-serif");
	p.setAttribute("font-size","10");
	p.setAttribute("fill","black");
	p.setAttribute("x",50+Math.sin(curang)*40);
	p.setAttribute("y",50-Math.cos(curang)*40);
	p.appendChild(document.createTextNode(hours[i]) );
	g.appendChild(p);
	
	curang += inc;
}


svg.appendChild(g);*/


