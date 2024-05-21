function $ID (id) {
  return document.getElementById(id)
}

async function jsonData(){
  const response = await fetch("daten.json", {cache: "no-store"}); 
  // cache disabled for debugging purposes 
  const data = await response.json();
  return data;
}

function getCoins() {
  const coins = localStorage.getItem("coins");
  if (!coins)
    return [];
  else
    return JSON.parse(coins);
}
async function resetCoins(coins){
  return Promise.all([...Array(coins.length).keys()].map(async (i) => {
    coins[i].id = parseInt(i);

    await getAPIData(coins[i].coincapID).then((result) => {
      value = []
      for (let x = (result.data.length - 1); x >= 0; x--)
        value.push({time: result.data[x].date, value: result.data[x].priceUsd});
      coins[i].value = value;
      coins[i].curValue = round(value[0].value, 4);
      coins[i].curRate = round(value[0].value / value[1].value * 100 - 100, 4);
    });

    await getAPIAdvancedData(coins[i].coincapID).then((result) => {
      coins[i].supply = parseFloat(result.data.supply);
      coins[i].maxSupply = parseFloat(result.data.maxSupply);
      if (!coins[i].maxSupply)
        coins[i].maxSupply = "Unknown";
      coins[i].marketCapUsd = parseFloat(result.data.marketCapUsd);
      coins[i].volumeUsd24Hr = parseFloat(result.data.volumeUsd24Hr);
    });
  })).then(() => {
      localStorage.setItem("coins", JSON.stringify(coins))
      localStorage.setItem("orders", JSON.stringify([]))
    }
  );
}

function round(val, amount){
  return Math.round(val * Math.pow(10, amount)) / Math.pow(10, amount);
}

function removeFromOrdersByID(id) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  let new_orders = []
  for(let i = 0; i < orders.length; i++) {
    if(orders[i].id != id) {
      new_orders.push(orders[i])
    }
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function changeOrderAmount(id, amount) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  let new_orders = []
    for(let i = 0; i < orders.length; i++) {
      let new_order = orders[i]
      if(orders[i].id === id) {
        new_order.amount = amount
      }
      new_orders.push(new_order)  
    }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function updateOrder(id, amount) {
  if(amount === -1) {
    removeFromOrdersByID(id)
  } else {
    changeOrderAmount(id, amount)
  }
}

function contains_order(orders, id) {
  for(let i = 0; i< orders.length; i++) {
    id = orders[i].id === id
    if(id) {
      return i;
    }
  }
  return -1;
}

function addOrder(order) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  if(orders) {
    var id = contains_order(orders, order.id)
     if(id == -1) {
     orders.push(order)
     new_orders = orders
   } else {
     orders[id].amount += order.amount
     new_orders = orders
   }
  } else {
    new_orders = [order]
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function getOrders() {
  let orders = JSON.parse(localStorage.getItem("orders"))
  new_orders = []
  orders.forEach((order) => {
    const coin = getCoinByID(order.id)
    new_order = {...coin, amount: order.amount, 
      end_price: round(coin.curValue*order.amount + 0.005, 2)}
    new_orders.push(new_order)
  })
  return {ord: new_orders}
}

function getCoinByID(id) {
  const coins = getCoins();
  if (id >= coins.length) return {};
  else if(id < 0) return {};
  else return coins[id];
}

async function getAPIData(cid){
  return fetch(url = "https://api.coincap.io/v2/assets/" + cid + "/history?interval=d1").then(response => {
    if (!response.ok) {
      throw new Error('API Network response was not ok');
    }
    return response.json();
  })
}

async function getAPIAdvancedData(cid){
  return fetch(url = "https://api.coincap.io/v2/assets/" + cid).then(response => {
    if (!response.ok) {
      throw new Error('API Network response was not ok');
    }
    return response.json();
  })
}

function toDate(date) {
  return date.slice(8, 10) + "." + date.slice(5, 7) + "." + date.slice(0, 4);
}

function toChartData(id, amount){
  const coin = getCoinByID(id);
  labels = [];
  data = [];
  for (let i = amount - 1; i >= 0; i--){
    labels.push(toDate(coin.value[i].time));
    data.push(coin.value[i].value);
  }

  return {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            data: data,
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 4,
            pointBackgroundColor: '#007bff'
        }]
    },
    options: {
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: false
            }
          }]
      },
      legend: {
          display: false
      }
    }
  }
}

function render(template_obj, dest_obj, data){
  const template = Handlebars.compile(template_obj.innerHTML);
  dest_obj.innerHTML = template(data)
}
