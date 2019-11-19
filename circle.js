var SVGNS = "http://www.w3.org/2000/svg";
var MODE_LOCAL = 0;
var MODE_UTC = 1;
var MODE_SWATCH = 2;
var MODE_MAX = MODE_SWATCH;
var mode = MODE_LOCAL;

var svg = document.getElementsByTagName('svg')[0];
var l;
var mlen = [31,28,31,30,31,30,31,31,30,31,30,31];
var mofs = [0,0,0,0,0,0,0,0,0,0,0,0];
var isLeap;
var curDate;
var curWeek = 0;


function updateTimezone(){
	if (mode == MODE_LOCAL){
		var val = (new Date()).getTimezoneOffset();
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
	} else {
		zoneDisplay.nodeValue=
		zoneDisplay.textContent=
		zoneDisplay.data=
		zoneDisplayGlow.nodeValue=
		zoneDisplayGlow.textContent=
		zoneDisplayGlow.data= ' 00:00';
	}
}

function japanese(num){
	var singles = ['〇','一','二','三','四','五','六','七','八','九'];
	var multi   = ['','十','百','千'];
	var multith = ['','万','億'];
	
	num = Math.round(num);
	if (num <= 0){
		return singles[0];
	} else if (num > 999999999999){
		num = 999999999999;
	}
	
	var out = '';
	var idx = 0;
	
	while (num){
		var part = num % 10;
		if (part) {
			num -= part;
			var sub = idx % 4;
			var mul = (idx - sub) / 4;
			if (sub){
				if (part == 1){
					out = multi[sub] + out;
				} else {
					out = singles[part] + multi[sub] + out;
				}
			} else {
				out = singles[part] + multith[mul] + out;
			}
			//alert(mul);
			//out = singles[part] + multi[sub] + multith[mul] + out;
		}
		
		idx++;
		num /= 10;
	}
	return out;
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
	for (var i = 0; i < 12; i++){
		mofs[i] = ofs;
		ofs += mlen[i];
	}
	curWeek = ((mofs[d.getMonth()] + d.getDate() - d.getDay()) / 7); 
	
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
		
	updateTimezone();
}

var nums = [12];
for (var i = 1; i < 12; i++) nums.push(i);
var hourTemplates = genTemplates(nums);

nums = ['W'];
for (var i = 5; i < 52; i+=4) nums.push(i);
var weekTemplates = genTemplates(nums);

nums = [];
for (var i = 1; i <= 7; i++) nums.push(i);
var _weekDayTemplates = genTemplates(nums);

var weekDayTemplates = {};
for (i in _weekDayTemplates){
	if (i != 'clear'){
		weekDayTemplates[i] = _weekDayTemplates[i];
	}
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

weekDayTemplates.clear = _weekDayTemplates.clear; 

var swatchView = document.getElementById('swatch');
var hourView = document.getElementById('hours');
var g = hourView;
var inc = Math.PI / 30;
var curang = 0;
var hourSel = 'ar';
var hours = hourTemplates[hourSel];
var hourLabels = [];

inc = Math.PI / 7;
var curang = 0;


var weekDays = weekDayTemplates[weekDaySel];


var wofs = 29;
var wpos = 21;
var wpos2 = wpos - 1;
var wlen = 16;
var wdif = 2;
var dayLabels = [];
g = document.getElementById('days');

g = document.getElementById('week');
inc = Math.PI / 26;
var curang = 0;//Math.PI;

var wofs = 0;
var wpos = 50;
var wpos2 = wpos - 1;
var wlen = 47;
var wdif = 1;
var weekLabels = [];
var weeks = weekTemplates['ar'];
var weekSel = 'ar';

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
	var val, day;
	if (mode == MODE_SWATCH){
		val = 
			(time.getUTCMilliseconds() / 1000) + 
			(time.getUTCSeconds() *    1) +
			(time.getUTCMinutes() *   60) +
			(time.getUTCHours()   * 3600);

		val /= 86400;
		secondPointer.setRotate( val * 360000 ,0,0 );
		minutePointer.setRotate( val * 3600 ,0,0 );
		hourPointer  .setRotate( val * 360 ,0,0 );
		//console.log (val);
		day = time.getUTCDay();		
	} else {		
		var mil, sec, min, hour, day;
		if (mode == MODE_LOCAL){
			mil = time.getMilliseconds();
			sec = time.getSeconds();
			min = time.getMinutes();
			hour = time.getHours();
			day = time.getDay();
		} else {
			mil = time.getUTCMilliseconds();
			sec = time.getUTCSeconds();
			min = time.getUTCMinutes();
			hour = time.getUTCHours();
			day = time.getUTCDay();		
		}	
		
		val =  sec + (mil/1000);
		secondPointer.setRotate(6* val ,0,0 ); 
		val = min + (val/60);
		minutePointer.setRotate(6* val ,0,0 );  
		val = hour + (val/60);
		hourPointer.setRotate(30* val ,0,0 );
		val /= 24;
	}
	val = day + val - 1;
	dayPointer.setRotate(val* rotday ,0,0 );
	val = curWeek + (val/7);
	weekPointer.setRotate(val* rotweek ,0,0 );
}

calcDay(new Date());
updateTime();
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
		dayLabels[l].Text.textContent = weekDays[l];
	}
}

function switchDay(){
	var next = false;
	for (var i in weekDayTemplates){
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
		hourLabels[l].Text.textContent = hours[l];
	}
}

function switchClock(){
	var next = false;
	for (var i in hourTemplates){
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

function switchWeek(){
	var next = false;
	for (var i in weekTemplates){
		if (i == weekSel){
			next = true;
			continue;
		} else if (next) {
			setWeekLabels(i);
			return;
		}
	}
	for (var i in weekTemplates){
		setWeekLabels(i);
		return;
	}
}

function setWeekLabels(name){
	weekSel = name;
	weeks = weekTemplates[weekSel];
	for (var l = 0; l < weekLabels.length; l++){
		weekLabels[l].Text.textContent = weeks[l];
	}
}

function switchMode(){
	mode++;
	if (mode > MODE_MAX){
		mode = 0;
	}
	if (mode == MODE_SWATCH){
		hourView.style.display = 'none';
		swatchView.style.display = '';
	} else {
		hourView.style.display = '';
		swatchView.style.display = 'none';		
	}
	updateTimezone();
}

setInterval(updateTime,1000/144);

var swatchDisplay = document.getElementById('swatch');
var hourDisplay = document.getElementById('hours');

var weekLabels = generatePoints(document.getElementById('week'), 52, 4, 48.5);
var swatchLabels = generatePoints(swatchDisplay, 100, 5, 40);
var hourLabels = generatePoints(hourDisplay, 60, 5, 40);
var dayLabels = generatePoints(document.getElementById('days'), 14, 2, 20);

for (var i = 0; i < 20; i+=2){
	if (i == 0){
		swatchLabels[i].Text.textContent = '0';
	} else {		
		swatchLabels[i].Text.textContent = '.' + i/2;
	}
}

if (mode == MODE_SWATCH){
	hourDisplay.style.display = 'none';
} else {
	swatchDisplay.style.display = 'none';
}
setHourLabels(hourSel);
setDayLabels(weekDaySel);
setWeekLabels(weekSel);