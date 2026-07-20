function loadCalendar(){


const page = document.getElementById("page");


page.innerHTML = `


<h1>
Calendar
</h1>



<div class="calendar-toolbar">


<button class="active">
Stock
</button>


<button>
Future
</button>


<button>
ETF
</button>


</div>





<div class="calendar-container">



<h2>
July 2026
</h2>



<div class="weekdays">

<div>Mon</div>
<div>Tue</div>
<div>Wed</div>
<div>Thu</div>
<div>Fri</div>
<div>Sat</div>
<div>Sun</div>

</div>





<div class="calendar-grid">


${generateCalendarDays()}


</div>



</div>






<div class="trade-area">


<div class="add-trade">


<h2>
Add Trade
</h2>



<label>
Date
</label>

<input type="date">



<label>
Time
</label>

<input type="time">



<label>
Trade Text
</label>


<textarea 
placeholder="
Paste your trade description here...
">
</textarea>



<button>
Parse Trade
</button>



</div>






<div class="history">


<h2>
Trade History
</h2>


<table>


<tr>

<th>
Date
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


</tr>



</table>


</div>



</div>


`;



}




function generateCalendarDays(){


let days="";


for(let i=1;i<=31;i++){


days += `


<div class="day">


<span>
${i}
</span>


<p>
$0
</p>


</div>


`;

}


return days;


}