var SVGNS = "http://www.w3.org/2000/svg";

var svg = document.getElementsByTagName('svg')[0];
var l;
var mlen = [31,28,31,30,31,30,31,31,30,31,30,31];
var mofs = [0,0,0,0,0,0,0,0,0,0,0,0];
var isLeap;
var curDate;
var curWeek = 0;

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
				
		if (part > 5){
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
}

function japanese(num){
	var singles = ['〇','一','二','三','四','五','六','七','八','九'];
	var multi   = ['十','百','千'];
	var multith = ['万','億'];
	
	num = Math.round(num);
	if (num < 0){
		num = 0;
	} else if (num > 999999999999){
		num = 999999999999;
	}
	
	multiidx = -1;
	multithdx = -1;
	out = '';
	while (num){
		var part = num % 10;
		num -= part;
		num /= 10;
	}
}

function calcDay(d){
	var dt = 
		(d.getFullYear() << 9) |
		(d.getMonth()    << 5) |
		(d.getDate()         )
	;
	
	if (dt == curDate) {
		return;
	}
	curDate = dt;
	var curYear = d.getFullYear();
	if (curYear % 400 == 0){
		isLeap = true;
	} else if (curYear % 100 == 0){
		isLeap = false;
	} else if (curYear % 4 == 0) {
		isLeap = true;
	} else {
		isLeap = false;
	}
	
	mlen[1] = isLeap ? 29 : 28;
	var ofs = -1;
	var di = new Date();
	di.setDate(1);
	di.setMonth(0);
	while (di.getDay()){
		di.setDate(di.getDate() - 1);
		ofs++;
	}
	if (ofs >= 3){
		ofs -= 7;
	}
	console.log(ofs);
	for (var i = 0; i < 12; i++){
		mofs[i] = ofs;
		ofs += mlen[i];
	}
	curWeek = ((mofs[d.getMonth()] + d.getDate() - d.getDay()) / 7); 
	console.log(mofs,d,curWeek);
	
	yearDisplay.nodeValue=
		yearDisplay.textContent=
		yearDisplay.data=	
		yearDisplayGlow.nodeValue=
		yearDisplayGlow.textContent=
		yearDisplayGlow.data=d.getFullYear();
		
		val = d.getMonth()+1;
		if (val < 10) val = String.fromCharCode(0xA0)+val;
		monthDisplay.nodeValue=
		monthDisplay.textContent=
		monthDisplay.data=
		monthDisplayGlow.nodeValue=
		monthDisplayGlow.textContent=
		monthDisplayGlow.data=val;
		
		val = d.getDate();
		if (val < 10) val = String.fromCharCode(0xA0)+val;
		dayDisplay.nodeValue=
		dayDisplay.textContent=
		dayDisplay.data=
		dayDisplayGlow.nodeValue=
		dayDisplayGlow.textContent=
		dayDisplayGlow.data=val;
		
		val = d.getTimezoneOffset();
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

var g = document.getElementById('hours');
var inc = Math.PI / 30;
var curang = 0;
var hourTemplates = {
		'ar' : [12,1,2,3,4,5,6,7,8,9,10,11],
		'rom' : ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'],
		'roc' : ['XII','I','II','III','IIII','V','VI','VII','VIII','VIIII','X','XI'],
		'jazh' : ['十二','一','二','三','四','五','六','七','八','九','十','十一'],
		'clear' : ['','','','','','','','','','','','']
}
var hourSel = 'ar';
var hours = hourTemplates[hourSel];
var hourLabels = [];
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
		
		t.Text = document.createTextNode(hours[idx]);
		t.appendChild(t.Text);
		hourLabels.push(t);
		
		g.appendChild(t);
	}
	p.setAttribute("d","M"+(50+Math.sin(curang)*40 )+" "+(50+Math.cos(curang)* 40)+ " L"+(50+Math.sin(curang)*l )+" "+(50+Math.cos(curang)* l)+ " Z");
	
	g.appendChild(p);
	
	curang += inc;
}	


inc = Math.PI / 7;
var curang = 0;
var weekDayTemplates = {
		'iso' : [1,2,3,4,5,6,7],
		'isr' : ['I','II','III','IV','V','VI','VII'],
		'isc' : ['I','II','III','IIII','V','VI','VII'],
}
var weekDaySel = 'clear';
if (navigator.languages){
	for (var i = 0; i < navigator.languages.length; i++){
		var lan = navigator.languages[i];
		if (lan.indexOf('-') >= 0){
			lan = lan.substring(0,lan.indexOf('-'));
		}
		if (weekDayI10n[lan] && !weekDayTemplates[lan]){
			weekDayTemplates[lan] = weekDayI10n[lan];
			if (weekDaySel == 'clear'){
				weekDaySel = lan;
			}
		}
	}	
} else {
	weekDayTemplates['en'] = weekDayI10n['en'];
}

if (!weekDayTemplates['ja']){
	weekDayTemplates['ja'] = weekDayI10n['ja'];
}
if (!weekDayTemplates['zh']){
	weekDayTemplates['zh'] = weekDayI10n['zh'];
}

weekDayTemplates['clear'] = ['','','','','','','']; 


var weekDays = weekDayTemplates[weekDaySel];

console.log(navigator);


var wofs = 29;
var wpos = 21;
var wpos2 = wpos - 1;
var wlen = 16;
var wdif = 2;
var dayLabels = [];

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
		var dist = 11;
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
		
		t.Text = document.createTextNode(weekDays[idx]);
		t.appendChild(t.Text);
		
		g.appendChild(t);
		dayLabels.push(t);
	}
	p.setAttribute("d","M"+(wofs+wpos+Math.sin(curang)*wpos2 )+" "+(wofs+wpos+Math.cos(curang)* wpos2)+ " L"+(wofs+wpos+Math.sin(curang)*l )+" "+(wofs+wpos+Math.cos(curang)* l)+ " Z");
	
	g.appendChild(p);
	
	curang += inc;
}	

g = document.getElementById('week');
inc = Math.PI / 26;
var curang = Math.PI;

var wofs = 0;
var wpos = 50;
var wpos2 = wpos - 1;
var wlen = 47;
var wdif = 2;
for (var i = 0; i < 52; i++){
	var p = document.createElementNS(SVGNS,'path');
	p.setAttribute("stroke","black");
	p.setAttribute("stroke-width","0.2");
	if (i % 4){
		l = wlen;
	}
	else {
		l = wlen - wdif;
	}
	p.setAttribute("d","M"+(wofs+wpos+Math.sin(curang)*wpos2 )+" "+(wofs+wpos+Math.cos(curang)* wpos2)+ " L"+(wofs+wpos+Math.sin(curang)*l )+" "+(wofs+wpos+Math.cos(curang)* l)+ " Z");
	
	g.appendChild(p);
	
	curang += inc;
}	


var weekPointer = document.getElementById('weekPointer').transform.baseVal.getItem(1);
var dayPointer = document.getElementById('dayPointer').transform.baseVal.getItem(1);
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



var rotday = 360 / 7;
var rotweek = 360 / 52;
function updateTime(){
	var time = new Date();
	calcDay(time);
	var val =  time.getSeconds() + (time.getMilliseconds()/1000);
	secondPointer.setRotate(6* val ,0,0 ); 
	val = time.getMinutes() + (val/60);
	minutePointer.setRotate(6* val ,0,0 );  
	val = time.getHours() + (val/60);
	hourPointer.setRotate(30* val ,0,0 );  
	val = time.getDay() + (val/24) - 1;
	dayPointer.setRotate(val* rotday ,0,0 );
	val = curWeek + (val/7);
	weekPointer.setRotate(val* rotweek ,0,0 );
	
	

	
}

calcDay(new Date());
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
function setDayLabels(name){
	weekDaySel = name;
	weekDays = weekDayTemplates[weekDaySel];
	for (var l = 0; l < dayLabels.length; l++){
		//console.log(dayLabels[l].Text,weekDays[l]);
		dayLabels[l].Text.textContent = weekDays[l];
	}
}

function switchDay(){
	var next = false;
	for (var i in weekDayTemplates){
		//console.log(i);
		if (i == weekDaySel){
			next = true;
			continue;
		} else if (next) {
			setDayLabels(i);
			return;
		}
	}
	for (var i in weekDayTemplates){
		setDayLabels(i);
		return;
	}
}


function setHourLabels(name){
	hourSel = name;
	hours = hourTemplates[hourSel];
	for (var l = 0; l < hourLabels.length; l++){
		console.log(hourLabels[l].Text,hourLabels[l]);
		hourLabels[l].Text.textContent = hours[l];
	}
}

function switchClock(){
	var next = false;
	for (var i in hourTemplates){
		console.log(i);
		if (i == hourSel){
			next = true;
			continue;
		} else if (next) {
			setHourLabels(i);
			return;
		}
	}
	for (var i in hourTemplates){
		setHourLabels(i);
		return;
	}
}