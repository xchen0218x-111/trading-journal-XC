function parseTradeText(text){


const result = {};


// Symbol

const symbolMatch =
text.match(/symbol\s+([A-Z]+:[A-Z]+)/i);


result.symbol =
symbolMatch ? symbolMatch[1] : "Unknown";



// Direction

if(text.toLowerCase().includes("short")){

result.type="Short";

}

else if(text.toLowerCase().includes("long")){

result.type="Long";

}

else{

result.type="Unknown";

}



// Exit Price

const closeMatch =
text.match(/price\s+([\d.]+)/i);


result.close =
closeMatch ? Number(closeMatch[1]) : 0;




// Quantity

const quantityMatch =
text.match(/for\s+(\d+)\s+units/i);


result.quantity =
quantityMatch ? Number(quantityMatch[1]) : 0;




// Entry price

const avgMatch =
text.match(/AVG Price was\s+([\d.]+)/i);


result.entry =
avgMatch ? Number(avgMatch[1]) : 0;



// Principal

result.principal =
result.entry * result.quantity;



// Profit

if(result.type==="Short"){


result.profit =
(result.entry-result.close)
*
result.quantity;


}

else{


result.profit =
(result.close-result.entry)
*
result.quantity;


}




// ROI

result.roi =
result.principal
?
(result.profit/result.principal*100)
:
0;



return result;


}