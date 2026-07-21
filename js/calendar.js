// =================================================
// Calendar V2 Final
// Part 1/3
// Calendar Engine + Month + Grid + Week Summary
// =================================================


// ================================
// State
// ================================


let selectedDay = null;

let currentAssetType = "Stock";


let currentYear = 2026;

let currentMonth = 6; 
// JS month
// July = 6



const monthNames = [

"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"

];




// ================================
// Month Engine
// ================================



function getMonthName(){

    return monthNames[currentMonth];

}





function getDaysInMonth(){


    return new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();


}





function getFirstDay(){


    let day = new Date(

        currentYear,
        currentMonth,
        1

    ).getDay();



    // Sunday 0
    // Monday 1


    return day === 0 ? 6 : day - 1;


}







function prevMonth(){


    currentMonth--;



    if(currentMonth < 0){


        currentMonth = 11;

        currentYear--;


    }



    selectedDay = null;


    refreshCalendar();


}







function nextMonth(){


    currentMonth++;



    if(currentMonth > 11){


        currentMonth = 0;

        currentYear++;


    }



    selectedDay = null;


    refreshCalendar();


}






// ================================
// Asset
// ================================


function changeAssetType(type){


    currentAssetType = type;


    selectedDay = null;


    refreshCalendar();


}






function getCurrentTrades(){


    return getTrades()

    .filter(t =>

        t.assetType === currentAssetType

    );


}






// ================================
// Load Calendar
// ================================



function loadCalendar(){


const page =

document.getElementById("page");



page.innerHTML = `



<h1>
Calendar
</h1>




<div class="calendar-toolbar">


<button

onclick="changeAssetType('Stock')"

class="${currentAssetType==="Stock"?"active":""}"

>

Stock

</button>




<button

onclick="changeAssetType('Future')"

class="${currentAssetType==="Future"?"active":""}"

>

Future

</button>




<button

onclick="changeAssetType('ETF')"

class="${currentAssetType==="ETF"?"active":""}"

>

ETF

</button>



</div>





<div class="calendar-container">



<div class="month-navigation">


<button onclick="prevMonth()">

◀

</button>



<h2 id="calendar-title">

${getMonthName()} ${currentYear}

</h2>




<button onclick="nextMonth()">

▶

</button>



</div>






<div class="weekdays">


<div>Mon</div>

<div>Tue</div>

<div>Wed</div>

<div>Thu</div>

<div>Fri</div>

<div>Sat</div>

<div>Sun</div>

<div>
Week
</div>


</div>






<div class="calendar-grid">


${generateCalendarDays()}


</div>





<div id="day-details"></div>




</div>







<div class="trade-area">


<div class="add-trade">



<h2>

Add Trade

</h2>



<label>

Trade Date & Time

</label>



<input

id="trade-datetime"

placeholder="2026/7/20 15:01:30"

>





<label>

Asset Type

</label>



<select id="asset-type">


<option>Stock</option>

<option>Future</option>

<option>ETF</option>


</select>





<label>

Trade Text

</label>



<textarea

id="trade-text"

placeholder="Paste your trade description here"

></textarea>





<label>

Emotion

</label>


<select id="emotion">


<option>Neutral</option>

<option>Confident</option>

<option>Fear</option>

<option>Greedy</option>

<option>Excited</option>

<option>Regret</option>


</select>





<label>

Decision Type

</label>


<select id="decision">


<option>Self</option>

<option>Trade Follow</option>


</select>





<label>

Note

</label>


<textarea id="trade-note"></textarea>





<button onclick="handleTradeParse()">

Parse Trade

</button>



<div id="parse-result"></div>



</div>





<div class="history">


<h2>

Trade History

</h2>



<table>


<tbody id="trade-history">


${renderTradeHistory()}


</tbody>


</table>



</div>



</div>



`;



}






// ================================
// Calendar Grid
// ================================



function generateCalendarDays(){



let html = "";



const emptyDays = getFirstDay();


const totalDays = getDaysInMonth();




let weekDays = [];




// empty cells

for(let i=0;i<emptyDays;i++){


    html += `

    <div class="day empty"></div>

    `;


    weekDays.push(null);


}






for(let day=1; day<=totalDays; day++){



    const today = new Date();



    const isToday =

    today.getFullYear() === currentYear &&

    today.getMonth() === currentMonth &&

    today.getDate() === day;





    html += `


<div

class="day ${isToday?"today":""}"

onclick="selectDay(${day},this)"

>



<span>

${day}

</span>



<div class="daily-profit ${getDailyProfitClass(day)}">

${getDailyProfit(day)}

</div>


<div class="trade-count">

${getDailyTradeCount(day)}

</div>



</div>



`;



weekDays.push(day);






if(weekDays.length === 7){



    html += renderWeekSummary(

        weekDays.filter(Boolean)

    );



    weekDays=[];



}



}






// remaining week


if(weekDays.length>0){



while(weekDays.length<7){


    html += `

    <div class="day empty"></div>

    `;


    weekDays.push(null);


}




html += renderWeekSummary(

weekDays.filter(Boolean)

);



}



return html;


}


// =================================================
// Calendar V2 Final
// Part 2/3
// Week Summary + Day Detail + Trade Input
// =================================================



// ================================
// Weekly Summary
// ================================


function calculateWeekStats(days){


let trades = [];



getCurrentTrades()

.forEach(t=>{


if(!t.date){

return;

}



const parts = t.date.split("-");


const year = Number(parts[0]);

const month = Number(parts[1]) - 1;

const day = Number(parts[2]);



if(

year === currentYear &&

month === currentMonth &&

days.includes(day)

){


trades.push(t);


}



});





let profit = 0;

let wins = 0;



trades.forEach(t=>{


profit += Number(t.profit)||0;



if(Number(t.profit)>0){

wins++;

}


});






return {


trades:

trades.length,



profit,



winRate:

trades.length

?

Math.round(

wins / trades.length * 100

)

:

0


};



}





function renderWeekSummary(days){



const stats =

calculateWeekStats(days);





return `



<div class="week-summary">


<b>

Week Summary

</b>



<div>

Trades:

${stats.trades}

</div>




<div class="${

stats.profit>=0

?

"dark-green"

:

"dark-red"

}">


Profit:

${

stats.profit>=0

?

"+$"

:

"-$"

}

${Math.abs(stats.profit).toFixed(2)}



</div>





<div>


Win:

${stats.winRate}%


</div>



</div>



`;



}







// ================================
// Daily Profit
// ================================



function getDailyProfit(day){



let profit = 0;



const date =

`${currentYear}-${

String(currentMonth+1).padStart(2,"0")

}-${
String(day).padStart(2,"0")
}`;



getCurrentTrades()

.forEach(t=>{


if(t.date === date){


profit += Number(t.profit)||0;


}



});





if(profit===0){

return "";

}



return (

profit>0

?

"+$"

:

"-$"

)

+

Math.abs(profit).toFixed(2);



}








function getDailyProfitClass(day){



const date =

`${currentYear}-${

String(currentMonth+1).padStart(2,"0")

}-${
String(day).padStart(2,"0")
}`;



const trades =

getCurrentTrades()

.filter(t=>t.date===date);





if(!trades.length){

return "";

}





let profit=0;

let principal=0;



trades.forEach(t=>{


profit += Number(t.profit)||0;


principal += Number(t.principal)||0;


});





return getProfitClass({

profit,

principal

});



}


// ================================
// Daily Trade Count
// ================================

function getDailyTradeCount(day){


const date =

`${currentYear}-${

String(currentMonth+1).padStart(2,"0")

}-${
String(day).padStart(2,"0")
}`;



const count =

getCurrentTrades()

.filter(t=>

t.date === date

).length;



return count ? count : "";


}






// ================================
// Day Select
// ================================


function selectDay(day,element){


if(selectedDay===day){


document
.getElementById("day-details")
.innerHTML="";


element.classList.remove("selected");


selectedDay=null;


return;


}




document

.querySelectorAll(".day")

.forEach(d=>{

d.classList.remove("selected");

});




element.classList.add("selected");


selectedDay=day;




const date =

`${currentYear}-${

String(currentMonth+1).padStart(2,"0")

}-${
String(day).padStart(2,"0")
}`;





const trades =

getCurrentTrades()

.filter(t=>

t.date===date

);






let totalProfit = 0;

let wins = 0;


trades.forEach(t=>{


totalProfit += Number(t.profit)||0;


if(Number(t.profit)>0){

wins++;

}


});



const winRate =

trades.length

?

Math.round(
wins/trades.length*100
)

:

0;






document

.getElementById("day-details")

.innerHTML = `



<div class="day-info">


<h2>

${getMonthName()}

${day},

${currentYear}

</h2>






<div class="day-summary">


<b>

${trades.length}

Trades

</b>



<span class="${

totalProfit>=0

?

"dark-green"

:

"dark-red"

}">


${

totalProfit>=0

?

"+$"

:

"-$"

}

${Math.abs(totalProfit).toFixed(2)}


</span>



<span>

Win ${winRate}%

</span>



</div>







<div class="trade-list">



${


trades.length


?


trades.map((t,index)=>`



<div class="mini-trade">



<div>


<b>

${index+1}. ${t.symbol || "-"}

</b>


<span>

${t.type || "-"}

</span>


</div>





<div>


<span class="${getProfitClass(t)}">


${

t.profit>=0

?

"+$"

:

"-$"

}

${Math.abs(t.profit).toFixed(2)}


</span>


</div>




</div>



`).join("")



:


"<p>No trades</p>"


}



</div>






</div>


`;



}







// ================================
// Add Trade
// ================================



function handleTradeParse(){



const text =

document.getElementById("trade-text").value;



const trade =

parseTradeText(text);





const datetime =

document.getElementById("trade-datetime").value;



const parsed =

parseTradeDateTime(datetime);





trade.date = parsed.date;


trade.time = parsed.time;




trade.assetType =

document.getElementById("asset-type").value;



trade.emotion =

document.getElementById("emotion").value;



trade.decision =

document.getElementById("decision").value;



trade.note =

document.getElementById("trade-note").value;



trade.marked=false;





saveTrade(trade);





alert("Trade Saved");



refreshCalendar();



}








// ================================
// Date Parser
// ================================



function parseTradeDateTime(input){



if(!input){


return {

date:"",

time:""

};


}





const parts =

input.trim().split(" ");





const datePart = parts[0];

const timePart = parts[1] || "00:00";





const arr =

datePart.split("/");





if(arr.length!==3){



return {

date:"",

time:""

};


}





return {


date:

`${arr[0]}-${

String(arr[1]).padStart(2,"0")

}-${
String(arr[2]).padStart(2,"0")
}`,



time:

timePart.substring(0,5)



};



}

// =================================================
// Calendar V2 Final
// Part 3/3
// History + Edit + Delete + Utility
// =================================================




// ================================
// Trade History
// ================================


function renderTradeHistory(){


const trades = getCurrentTrades();




if(!trades.length){


return `


<tr>

<td colspan="8">

No trades yet

</td>

</tr>


`;



}





return `


<tr>

<th>
⭐
</th>


<th>
Date & Time
</th>


<th>
Symbol
</th>


<th>
Type
</th>


<th>
Profit
</th>


<th>
Note
</th>


<th>
Edit
</th>


<th>
Delete
</th>


</tr>



`

+

trades.map(t=>`



<tr>



<td>


<button

class="star-btn ${t.marked?"marked":""}"

onclick="toggleStar('${t.id}')"

>


${t.marked?"★":"☆"}


</button>



</td>




<td>


${t.date}


<br>


<span>

${t.time || "-"}

</span>



</td>





<td>

${t.symbol || "-"}

</td>




<td>

${t.type || "-"}

</td>





<td>


<span class="${getProfitClass(t)}">


${

t.profit>=0

?

"+$"

:

"-$"

}


${Math.abs(t.profit).toFixed(2)}



</span>



</td>





<td class="note-column">


${t.note || "-"}


</td>






<td>


<button

class="icon-btn edit-btn"

onclick="editTrade('${t.id}')"

>

✏️

</button>


</td>







<td>


<button

class="icon-btn delete-btn"

onclick="removeTrade('${t.id}')"

>

🗑️

</button>


</td>





</tr>



`).join("");



}







// ================================
// Star
// ================================



function toggleStar(id){


toggleMarkTrade(id);


refreshCalendar();


}







// ================================
// Delete
// ================================


function removeTrade(id){


if(!confirm("Delete this trade?")){


return;


}



deleteTrade(id);



refreshCalendar();


}









// ================================
// Edit
// ================================



function editTrade(id){



const trade =

getTrades()

.find(t=>t.id===id);




if(!trade){

return;

}





document.body.insertAdjacentHTML(

"beforeend",


`


<div class="edit-modal" id="edit-modal">


<div class="edit-box">


<h2>

Edit Trade

</h2>



<label>

Date & Time

</label>


<input

id="edit-datetime"

value="${trade.date || ""} ${trade.time || ""}"

>





<label>

Symbol

</label>


<input

id="edit-symbol"

value="${trade.symbol || ""}"

>




<label>

Type

</label>


<input

id="edit-type"

value="${trade.type || ""}"

>





<label>

Entry Price

</label>


<input

id="edit-entry"

value="${trade.entry || ""}"

>




<label>

Close Price

</label>


<input

id="edit-close"

value="${trade.close || ""}"

>





<label>

Quantity

</label>


<input

id="edit-quantity"

value="${trade.quantity || ""}"

>





<label>

Emotion

</label>


<input

id="edit-emotion"

value="${trade.emotion || ""}"

>




<label>

Decision

</label>


<input

id="edit-decision"

value="${trade.decision || ""}"

>




<label>

Note

</label>


<textarea id="edit-note">

${trade.note || ""}

</textarea>






<button

onclick="saveEditTrade('${trade.id}')"

>

Save

</button>




<button

onclick="closeEditModal()"

>

Cancel

</button>





</div>


</div>



`



);



}









function saveEditTrade(id){



const trades=getTrades();



const trade =

trades.find(t=>t.id===id);





if(!trade){

return;

}






const parsed =

parseTradeDateTime(

document.getElementById("edit-datetime").value

);



trade.date = parsed.date;

trade.time = parsed.time;





trade.symbol =

document.getElementById("edit-symbol").value;



trade.type =

document.getElementById("edit-type").value;




trade.entry =

Number(

document.getElementById("edit-entry").value

)||0;



trade.close =

Number(

document.getElementById("edit-close").value

)||0;



trade.quantity =

Number(

document.getElementById("edit-quantity").value

)||0;



trade.emotion =

document.getElementById("edit-emotion").value;



trade.decision =

document.getElementById("edit-decision").value;



trade.note =

document.getElementById("edit-note").value;







if(trade.type==="Long"){


trade.profit =

(trade.close-trade.entry)

*

trade.quantity;


}




if(trade.type==="Short"){


trade.profit =

(trade.entry-trade.close)

*

trade.quantity;


}




trade.principal =

trade.entry *

trade.quantity;





updateTrade(trade);



closeEditModal();



refreshCalendar();



}









function closeEditModal(){



const modal =

document.getElementById("edit-modal");



if(modal){

modal.remove();

}


}









// ================================
// Refresh
// ================================



function refreshCalendar(){


loadCalendar();


}








// ================================
// Profit Color
// ================================



function getProfitClass(trade){



const ratio =

trade.principal

?

trade.profit / trade.principal

:

0;





if(trade.profit>0){



if(ratio>=0.05){


return "bright-green";


}



return "dark-green";



}






if(trade.profit<0){



if(Math.abs(ratio)>0.03){


return "bright-red";


}



return "dark-red";


}






return "";



}