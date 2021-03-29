
/*****************************************************************************
                                  日期资料
*****************************************************************************/
var shengxiao;
var lunarInfo=new Array(
0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0)

/*****************************************************************************
     输入公历日期，输出农历生肖：calendarCopy(year,month,day)
*****************************************************************************/
function lYearDays(y) {
  var i, sum = 348
  for(i=0x8000; i>0x8; i>>=1) sum += (lunarInfo[y-1900] & i)? 1: 0
  return(sum+leapDays(y))
}


function leapDays(y) {
  if(leapMonth(y))  return((lunarInfo[y-1900] & 0x10000)? 30: 29)
  else return(0)
}


function leapMonth(y) {
  return(lunarInfo[y-1900] & 0xf)
}


function monthDays(y,m) {
  return( (lunarInfo[y-1900] & (0x10000>>m))? 30: 29 )
}

function Lunar(objDate) {

  var i, leap=0, temp=0
  var baseDate = new Date(1900,0,31)
  var offset   = (objDate - baseDate)/86400000

  this.dayCyl = offset + 40
  this.monCyl = 14

  for(i=1900; i<2050 && offset>0; i++) {
     temp = lYearDays(i)
     offset -= temp
     this.monCyl += 12
  }

  if(offset<0) {
     offset += temp;
     i--;
     this.monCyl -= 12
  }

  this.year = i
  this.yearCyl = i-1864

  leap = leapMonth(i)
  this.isLeap = false

  for(i=1; i<13 && offset>0; i++) {
     if(leap>0 && i==(leap+1) && this.isLeap==false)
        { --i; this.isLeap = true; temp = leapDays(this.year); }
     else
        { temp = monthDays(this.year, i); }

     if(this.isLeap==true && i==(leap+1)) this.isLeap = false

     offset -= temp
     if(this.isLeap == false) this.monCyl ++
  }

  if(offset==0 && leap>0 && i==leap+1)
     if(this.isLeap)
        { this.isLeap = false; }
     else
        { this.isLeap = true; --i; --this.monCyl;}

  if(offset<0){ offset += temp; --i; --this.monCyl; }

  this.month = i
  this.day = offset + 1
}

//////////////////////////////////////////////////////////////////////////
function getshengxiao(birthDay){
       if(birthDay==null||birthDay ==""||typeof(birthDay) == "undefined"){		
               return '';
       }else{	
               var str,y,m,cmbcDay;
               if( birthDay.indexOf("-")!=-1){
                       str = birthDay.split("-");
                       y = str[0];
                       m= str[1];
                       cmbcDay =str[2];	
                       calendarCopy(y,m,cmbcDay);
                       return shengxiao;	
               }else{			
                       y = birthDay.substring(0,4);
                       m= birthDay.substring(4,6);
                       cmbcDay =birthDay.substring(6,8);	
                       calendarCopy(y,m,cmbcDay);
                       return shengxiao;	
               }
       }
}
function calendarCopy(y,m,cmbcDay) {

  var sDObj, lDObj, lY, lM, lD=1, lL, lX=0
  var lDPOS = new Array(3)
  var n = 0
  var firstLM = 0

  sDObj = new Date(y,m,1)           
     if(lD>lX) {
        sDObj = new Date(y,m-1,cmbcDay)    
        lDObj = new Lunar(sDObj)    
        lY    = lDObj.year           
        lM    = lDObj.month          
        lD    = lDObj.day            
        lL    = lDObj.isLeap         
        lX    = lL? leapDays(lY): monthDays(lY,lM) 
     }
     //alert("**"+lY);
     get_animal(lY);
}


function get_animal(year) {
        var animal='';
       if (year=='' || year==undefined){
               alert('输入非法');
               return;
       }
       var s = Math.abs((year-1900)%12);
       switch(s){
               case 0: animal = '鼠';break;
               case 1: animal = '牛';break;
               case 2: animal = '虎';break;
               case 3: animal = '兔';break;
               case 4: animal = '龙';break;
               case 5: animal = '蛇';break;
               case 6: animal = '马';break;
               case 7: animal = '羊';break;
               case 8: animal = '猴';break;
               case 9: animal = '鸡';break;
               case 10: animal = '狗';break;
               case 11: animal = '猪';break;
               default: alert('输入非法');return;
       }
       shengxiao = animal;
     
}
export default getChineseZodiac
/////////////////////////////////////////////////////////
