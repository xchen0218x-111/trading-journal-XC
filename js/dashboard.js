function loadDashboard(){


const page =
document.getElementById("page");


const trades =
getTrades();



const today =
new Date()
.toISOString()
.split("T")[0];



const todayTrades =
trades.filter(t=>
t.date===today
);



const weekTrades =
getThisWeekTrades(trades);



const todayStats =
calculateStats(todayTrades);



const weekStats =
calculateStats(weekTrades);



const totalStats =
calculateStats(trades);




page.innerHTML = `



<h1>
Dashboard
</h1>





${createDashboardSection(
"Today",
todayStats,
true
)}





${createDashboardSection(
"This Week",
weekStats,
false
)}





${createDashboardSection(
"Total",
totalStats,
false
)}




`;



}








function createDashboardSection(title,stats){


return `


<div class="dashboard-section">


<h2>

${title}

</h2>



<div class="cards">



${createStatCard(
"Profit",
stats.profit,
stats
)}



${createStatCard(
"Win Rate",
stats.winRate+"%"
)}




${title==="Today"
?
createStatCard(
"Best Win",
stats.bestWin
)
:
""
}



${title==="Today"
?
createStatCard(
"Worst Loss",
stats.worstLoss
)
:
""
}




${createStatCard(
"Trades",
stats.count
)}




</div>


</div>



`;

}








function calculateStats(trades){



if(!trades.length){


return {


profit:"+$0.00",

profitValue:0,

principal:0,


winRate:0,


bestWin:"+$0.00",


worstLoss:"-$0.00",


count:0



};


}




let profit=0;

let principal=0;

let wins=0;

let best=0;

let worst=0;



trades.forEach(t=>{


const p =
Number(t.profit)||0;


const money =
Number(t.principal)||0;



profit += p;

principal += money;



if(p>0){

wins++;

}



if(p>best){

best=p;

}



if(p<worst){

worst=p;

}



});





return {


profit:


(profit>=0?"+$":"-$")
+
Math.abs(profit)
.toFixed(2),



profitValue:profit,

principal:principal,



winRate:


((wins/trades.length)*100)
.toFixed(1),



bestWin:


best>0
?
"+$"+best.toFixed(2)
:
"+$0.00",



worstLoss:


worst<0
?
"-$"+Math.abs(worst).toFixed(2)
:
"-$0.00",



count:trades.length



};



}









function createStatCard(title,value,data=null){



let colorClass="";




if(title==="Profit" && data){


colorClass =

getProfitClass({

profit:data.profitValue,

principal:data.principal

});


}




if(title==="Win Rate"){


if(Number(value.replace("%",""))>=50){

colorClass="bright-green";

}

}





if(title==="Best Win"){


colorClass="bright-green";

}



if(title==="Worst Loss"){


colorClass="bright-red";

}




return `


<div class="card">


<h3>

${title}

</h3>



<p class="${colorClass}">

${value}

</p>



</div>


`;

}









function getThisWeekTrades(trades){



const now =
new Date();



const day =
now.getDay() || 7;



const monday =

new Date(

now.getFullYear(),

now.getMonth(),

now.getDate()-day+1

);



monday.setHours(0,0,0,0);





return trades.filter(t=>{


const tradeDate =

new Date(
t.date+"T00:00:00"
);



return tradeDate>=monday;



});



}