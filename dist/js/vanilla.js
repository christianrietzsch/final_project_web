function $ID (id) {
  return document.getElementById(id)
}

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

function removeFromOrdersByID(id) {
  const orders = getOrders().ord
  let new_orders = []
  for(let i = 0; i < orders.length; i++) {
    if(orders[i].index != id) {
      new_orders.push(orders[i])
    }
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function changeOrderAmount(id, amount) {
  const orders = getOrders().ord
  let new_orders = []
    for(let i = 0; i < orders.length; i++) {
      let new_order = orders[i]
      if(orders[i].index === id) {
        new_order.amount = amount
        new_order.end_price = amount*new_order.value
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

function contains_order(orders, name) {
  for(let i = 0; i< orders.length; i++) {
    index = orders[i].name === name
    if(index) {
      return i;
    }
  }
  return -1;
}

function addOrder(order) {
  orders = JSON.parse(localStorage.getItem("orders"))
  if(orders) {
    index = contains_order(orders, order.name)
     if(index == -1) {
     orders.push(order)
     new_orders = orders
   } else {
     orders[index].amount += order.amount
     new_orders = orders
   }
  } else {
    new_orders = [order]
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function getOrders() {
  let orders = JSON.parse(localStorage.getItem("orders"))
  return {ord: orders}
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

function init_shop_item(json) {
  const name = json.name
  arrow = $ID(name + "-Arrow")
  arrow.innerHTML = json.rate >= 0 ? "&uarr;" : "&darr;"
  $ID(name + "-Buy").addEventListener("click",
    function() {
      render(modal_template, modal_template.nextElementSibling, json)
      $ID("buy-btn").addEventListener("click", 
        function() {
          let val = amount.value
          if(val && val > 0) {
            addOrder({"index": json.index, "name": json.name, 
              "description": json.description, 
              "value": json.value, "amount": parseInt(val), 
              "end_price": parseInt(val)* parseInt(json.value)})
            close = $ID("close")
            close.click()
          } else {
            console.log("NOT ALLOWED")
            // add effect later
          }
        })
    })
  $ID(name + "-More").addEventListener("click", 
    function() {
      render($ID("more_template"), $ID("more_template").nextElementSibling, json)
  })
}

document.getElementById('endButton').addEventListener('click', function() {
  // Show the quiz section
  document.getElementById('quizSection').style.display = 'block';
  // Call a function to load the quiz questions
  loadQuiz();
});

// Quiz questions
const questions = [
  {
    question: "What is the first cryptocurrency?",
    options: ["Bitcoin", "Ethereum", "Ripple", "Litecoin"],
    answer: "Bitcoin"
  },
  {
    question: "Who is the creator of Bitcoin?",
    options: ["Satoshi Nakamoto", "Vitalik Buterin", "Charlie Lee", "Roger Ver"],
    answer: "Satoshi Nakamoto"
  },
  {
    question: "What technology is used to secure cryptocurrency transactions?",
    options: ["Blockchain", "Artificial Intelligence", "Cloud Computing", "Big Data"],
    answer: "Blockchain"
  }
];

function loadQuiz() {
  const quizQuestions = document.getElementById('quizQuestions');
  quizQuestions.innerHTML = '';

  questions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `
            <h4>Question ${index + 1}: ${question.question}</h4>
            <div>
                ${question.options.map((option, i) => `
                    <div>
                        <input type="radio" id="q${index}_option${i}" name="q${index}" value="${option}">
                        <label for="q${index}_option${i}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
    quizQuestions.appendChild(questionElement);
  });
}

document.getElementById('submitQuiz').addEventListener('click', function() {
  let score = 0;
  questions.forEach((question, index) => {
    const selectedOption = document.querySelector(`input[name=q${index}]:checked`);
    if (selectedOption) {
      if (selectedOption.value === question.answer) {
        score++;
      }
    }
  });
  alert(`Your score: ${score}/${questions.length}`);
});

