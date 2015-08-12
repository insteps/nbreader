#!/bin/sh
c_='\033['; #c_='\e['; #\x1B
n_='0;'; # normal text
b_='1;'; # bold ,      reset=21
d_='2;'; # dim ,       reset=22
u_='4;'; # underline , reset=24
bl_='5;'; # blink ,    reset=25
r_='7;'; # reverse ,   reset=27
h_='8;'; # hidden ,    reset=28
cBLACK=$c_'0;30m';   cBGRAY=$c_'1;30m';    cLGRAY=$c_'0;37m';    cDGRAY=$c_'0;90m';
cRED=$c_'0;31m';     cBRED=$c_'1;31m';     cLRED=$c_'0;91m';
cGREEN=$c_'0;32m';   cBGREEN=$c_'1;32m';   cLGREEN=$c_'0;92m';
cYELLOW=$c_'0;93m';  cBYELLOW=$c_'1;33m';  cLYELLOW=$c_'0;93m';
cBROWN=$c_'0;33m';
cBLUE=$c_'0;34m';    cBBLUE=$c_'1;34m';    cLBLUE=$c_'0;94m';
cPURPLE=$c_'0;35m';  cBPURPLE=$c_'1;35m';  cLPURPLE=$c_'0;95m';
cCYAN=$c_'0;36m';    cBCYAN=$c_'1;36m';    cLCYAN=$c_'0;96m';
#cLGRAY=$c_'0;37m';                           
cWHITE=$c_'0;97m';   cBWHITE=$c_'1;37m';

cNORMAL=$c_'00m';

cbBLACK=$c_'40m';   cbLGRAY=$c_'47m';   cbDGRAY=$c_'100m';
cbRED=$c_'41m';     cbLRED=$c_'101m';
cbGREEN=$c_'42m';   cbLGREEN=$c_'102m';
cbBROWN=$c_'43m';   cbLBROWN=$c_'103m';
cbBLUE=$c_'44m';    cbLBLUE=$c_'104m';
cbPURPLE=$c_'45m';  cbLPURPLE=$c_'105m';
cbCYAN=$c_'46m';    cbLCYAN=$c_'106m';
cbWHITE=$c_'107m';
cbNORMAL=$c_'49m';
