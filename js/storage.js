function getTrades(){

const data = localStorage.getItem("trades");


return data
?
JSON.parse(data)
:
[];

}






function saveTrade(trade){



const trades = getTrades();



// create unique id

trade.id =
Date.now().toString();



if(!trade.assetType){

trade.assetType="Stock";

}



if(trade.marked===undefined){

trade.marked=false;

}




trades.push(trade);



localStorage.setItem(
"trades",
JSON.stringify(trades)
);



}








function updateTrade(updatedTrade){



const trades = getTrades();



const index =
trades.findIndex(
t=>t.id===updatedTrade.id
);



if(index!==-1){


trades[index]=updatedTrade;



localStorage.setItem(
"trades",
JSON.stringify(trades)
);


}



}








function deleteTrade(id){



const trades =
getTrades();



const filtered =
trades.filter(
t=>t.id!==id
);



localStorage.setItem(
"trades",
JSON.stringify(filtered)
);



}








function toggleMarkTrade(id){



const trades =
getTrades();



const trade =
trades.find(
t=>t.id===id
);



if(trade){


trade.marked =
!trade.marked;


}



localStorage.setItem(
"trades",
JSON.stringify(trades)
);



}








function clearTrades(){

localStorage.removeItem("trades");

}