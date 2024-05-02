async function jsonData(){
  const response = await fetch("daten.json", {cache: "no-store"}); 
  // cache disabled for debugging purposes 
  const data = await response.json();
  return data;
}

async function getCoins() {
  const coins = localStorage.getItem("coins");
  if (!coins)
    return [];
  else
    return JSON.parse(coins);
}
function setCoins(coins){
  localStorage.setItem("coins", JSON.stringify(coins));
}

function getCurrentCoinID(){
  return parseInt(localStorage.getItem("current"));
}

async function getCurrentCoin() {
  var id = parseInt(localStorage.getItem("current"));
  if (id == null) id = 0;
  else if (id < 0) return {};

  const coins = await getCoins();
  if (id >= coins.length) return {};
  else return coins[id];
}

function render(template_obj, dest_obj, data){
  const template = Handlebars.compile(template_obj.innerHTML);
  dest_obj.innerHTML = template(data)
}