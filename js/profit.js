function getProfitClass(trade){


const ratio =
trade.principal
?
trade.profit / trade.principal
:
0;



if(trade.profit > 0){


if(ratio >= 0.05){

return "bright-green";

}


return "dark-green";


}



if(trade.profit < 0){



if(Math.abs(ratio)>0.03){

return "bright-red";

}



return "dark-red";


}



return "";

}