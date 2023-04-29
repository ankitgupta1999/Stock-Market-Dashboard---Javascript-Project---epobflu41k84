const api_key='DA452BSDFSBL814Z';
let submit=document.querySelector(".fa-search");
////////////////////////////////////////////////////////////////////////////////////////
submit.addEventListener("click",()=>{
    let time=document.querySelector("#time-series").value;
    let symbol=document.querySelector("#symbol").value.toUpperCase();
    let interval="";
    if(time=="TIME_SERIES_INTRADAY"){
        interval="interval=15min&";
    } 
    const api=`https://www.alphavantage.co/query?function=${time}&symbol=${symbol}&${interval}apikey=${api_key}`;
////////////////////////////
    fetch(api)
    .then((response)=>{
        return response.json();
    })
    .then(function (data){
        let stock_name=symbol;
        let close_price;
        let open_price;
        let t_body=document.createElement('tbody');
        for(let field in data){
            
            if(field.includes("Time Series")){
                const val=Object.entries(data[field]);
                const size= val.length;
                for(let i=0;i<10;i++){
                    
                    let row=document.createElement('tr');
                    let td_first=document.createElement('td');
                    
                    td_first.innerText=val[size-i-1][0];
                    row.append(td_first);

                    for(let x in val[size-i-1][1]){
                        let td_next=document.createElement('td');
                        let y=``;
                        if(x.includes('open')){
                            y=val[size-i-1][1][x];
                            if(i==0){
                                open_price=y;
                            }
                        }
                        else if(x.includes('high')) y=val[size-i-1][1][x];
                        else if(x.includes('low')) y=val[size-i-1][1][x];
                        else if(x.includes('close') && !x.includes('adjusted close')){
                            y=val[size-i-1][1][x];
                            if(i==0){
                                close_price=y;
                            }
                        } 
                        else if(x.includes('volume')){
                            y=val[size-i-1][1][x];
                        } 

                        if(y.length>0){
                            td_next.innerText=y;
                            row.append(td_next);
                        }
                    }
                    t_body.append(row);
                }
                
            }
        }

       stock(stock_name,open_price,close_price,t_body,time);
    })
/////////////////////////////
    document.querySelector("#time-series").value="none";
    document.querySelector("#symbol").value="";
});

////////////////////////////////////////////////////////////////////////////////////////////
let wishlist=document.querySelector(".wishlist");
////////////////////////////////////////////////////////////////////////////////////////////
const stock=(name,open_price,close_price,tbody,time)=>{
    let time_interval;
    if(time=="TIME_SERIES_INTRADAY") time_interval="INTRADAY";
    else if(time=="TIME_SERIES_DAILY_ADJUSTED") time_interval="DAILY";
    else if(time=="TIME_SERIES_WEEKLY") time_interval="WEEKLY";
    else time_interval="MONTHLY";

    ///////////////////////////////

    const stockItem=document.createElement("div");
    stockItem.classList.add("stock");
    stockItem.innerHTML=`
    <div class="stock-box">
    <h3>${name}</h3>
    <div class="current-price">${close_price}</div>
    <p>${time_interval}</p>
    <i class="fa fa-times"></i>
    </div>

    <div class="stock-data">
    <table>
    <thead>
    <th>INTERVALS</th>
    <th>OPEN</th>
    <th>HIGH</th>
    <th>LOW</th>
    <th>CLOSE</th>
    <th>VOLUME</th>
    </thead>
    ${tbody.innerHTML}
    </table>
    </div>

  `;

  stockItem.querySelector(".current-price").classList.add((open_price>close_price)?"loss":"profit");

  stockItem.querySelector(".stock-box i").addEventListener("click",()=>{
    stockItem.remove();
  });

  stockItem.querySelector(".stock-box").addEventListener("click",()=>{
    stockItem.querySelector(".stock-data").classList.toggle("show");
  });
  wishlist.append(stockItem);
};
