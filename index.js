//Refactor
/*

calcTotalPrice
--> displayInventory adds a "selected-quantity" class to every input element
-->calcTotalPrice adds an event listener to that "selected-quantity" element
--> on change, retrieve the price within the parent div, multiply it by the quantity, and record
    the total price in the total price element
--> will have to change how classes and are IDs are created in the display inventory function to 
    make it easier to access the correct elements for calculating the price

-->getItem function uses "this" to find its parent, and then retrieve the name, price and quantity of the item
the user selected before clicking "add to cart"
-->that information is then pushed into the user's cart as an object in its array of objects
*/



//Look at total price, any way to simplify or separate out concerns?

//Inventory is an array of objects, each object representing an inventory item and its price per unit (ie $2.50 per apple)
var inventory = [
  {name: "apples", 
   price: 2.50,
  },

  {name: "bananas", 
   price: 5.00,
  },

  {name: "oranges", 
   price: 3.50,
  },
]

//Cart instantiates as an empty array of objects. 
//When the user clicks on an item, it is added to the cart with the relevant properties of name and price taken from the inventory
var cart = []

//on load, display each item in the inventory array of objects 
function displayInventory(arr){
  arr.map(function (item){ 
  var div = document.createElement("DIV");
  div.className = "item";
  var nameContainer = document.createElement("P")
  var name = document.createTextNode(item.name);
  nameContainer.className = "item-name";
  nameContainer.appendChild(name);
  div.appendChild(nameContainer); 

  //Price: $
  var priceContainer = document.createElement("p");
  var priceText = document.createTextNode("Price: $")
  priceContainer.appendChild(priceText);

  var priceNumberContainer = document.createElement("span");
  var priceNumber = document.createTextNode((item.price).toFixed(2)+"");
  priceNumberContainer.className = "ppu"
  priceNumberContainer.appendChild(priceNumber);
  priceContainer.appendChild(priceNumberContainer)


  div.appendChild(priceContainer);
  
  var quantityContainer = document.createElement("p");
  var quantityText = document.createTextNode("Quantity: ")   
  quantityContainer.appendChild(quantityText);
 
  var quantityInput = document.createElement("input");
  //create a quantity input id. 
  //This will be referenced later when determining total price
  quantityInput.setAttribute("id", item.name+"-selected-quantity") //UNIQUE
  quantityInput.className = "quantity-input"
  quantityInput.placeholder = 1;
  quantityContainer.appendChild(quantityInput);
  div.appendChild(quantityContainer);
  
  var totalPriceContainer = document.createElement("p");
  //create a total price id. 
  //This will be referenced later when determining total price
  totalPriceContainer.className = "total-price" //UNIQUE
  var price = document.createTextNode("$"+(item.price).toFixed(2)+"")
  totalPriceContainer.appendChild(price);
  div.appendChild(totalPriceContainer);

  document.querySelector(".inventory-container").appendChild(div);  

  var addToCartBtn = document.createElement("button");
  addToCartBtn.innerHTML = "Add to Cart"
  addToCartBtn.className = "add-to-cart-btn" 
  div.appendChild(addToCartBtn); 

  })
  addToCartListener();
  calcTotalPriceListener(); 
}

//on load, display an empty cart
function displayCart(){
  var cartParagraph = document.createElement("P");
  var cart = document.createTextNode("Cart");
  cartParagraph.appendChild(cart); 
  document.querySelector(".cart-container").appendChild(cartParagraph)  
}

function calcTotalPriceListener(){
  var quantInput = document.getElementsByClassName("quantity-input"); 
  for(i=0; i<quantInput.length; i++){
    quantInput[i].addEventListener("change", calcTotalPrice)
  }
}

function calcTotalPrice(){
  var itemContainer = this.closest("div"); 
  var quantity = itemContainer.querySelector(".quantity-input").value; 
  var ppu = itemContainer.querySelector(".ppu").innerHTML; 
  var totalPrice = itemContainer.querySelector(".total-price"); 
  totalPrice.innerHTML = "$"+(quantity*ppu).toFixed(2)+""
}

displayInventory(inventory)
displayCart(); 


//Adds an event listener to every inventory item that is displayed to the user
function addToCartListener(){
  var addToCartBtn = document.getElementsByClassName("add-to-cart-btn");
  for(i=0; i<addToCartBtn.length; i++){
    addToCartBtn[i].addEventListener("click", getItem)
  }
}


//Called when user clicks on an inventory item
//Function retrieves the name of the item from the DOM and finds a matching item name in the inventory array of objects
function getItem(){ 
  var itemContainer = this.closest("div"); 
  var quantity = itemContainer.querySelector(".quantity-input").value;
  var itemName = itemContainer.querySelector(".item-name").innerHTML
  var newItem = {}; 
  inventory.map(function (inventoryItem){
    if(itemName === inventoryItem.name){
      newItem = inventoryItem
    }
  })
  addItemToCart(newItem, quantity)
}

//Checks to see if that inventory item is already in the cart
//If the inventory item is NOT in the cart, then the function pushes the object into the user's cart, assigns a quantity property with the value of 1, and fires displayNewItem
function addItemToCart(item, itemQuantity){
  var itemIsNew = true; 
  cart.forEach(function (cartItem){
    if(cartItem.name === item.name){ 
      //Next: add function here to retrieve quantity from input and add that quantity to the matching item quantity in cart             
      return itemIsNew = false
    } 
  })
  if(itemIsNew){
    cart.push(item); 
    item.quantity = itemQuantity;  
    displayNewItem(item)
  }
}

//Function creates several DOM elements to display the new item selected by the user in the user's cart
function displayNewItem(newItem){
  var div = document.createElement("DIV");
  var nameContainer = document.createElement("P")
  var name = document.createTextNode(newItem.name);
  nameContainer.appendChild(name);
  div.appendChild(nameContainer); 
   
  var priceContainer = document.createElement("p");
  var price = document.createTextNode("$"+(newItem.price).toFixed(2)+"")
  priceContainer.appendChild(price);
  div.appendChild(priceContainer);
  
  var quantityContainer = document.createElement("p");
  var quantityText = document.createTextNode("Quantity: ")   
  quantityContainer.appendChild(quantityText);
 
  var quantityInput = document.createElement("input");
  //create a quantity input id. 
  //This will be referenced later when determining total price
  quantityInput.setAttribute("id", newItem.name+"-quantity")
  quantityInput.placeholder = newItem.quantity;
  quantityContainer.appendChild(quantityInput);
  div.appendChild(quantityContainer);
  
  var totalPriceContainer = document.createElement("p");
  //create a total price id. 
  //This will be referenced later when determining total price
  totalPriceContainer.setAttribute("id", newItem.name+"-total-price")
  var price = document.createTextNode("$"+(newItem.price).toFixed(2)+"")
  totalPriceContainer.appendChild(price);
  div.appendChild(totalPriceContainer);
  
  div.className = "cart-item";
  document.querySelector(".cart-container").appendChild(div);  
  
  totalPriceEventListener(newItem)
}

//Adds an event listener to each item displayed in the user's cart. 
//If the user changes the quantity input, then updateCartItemQuantity is fired
function totalPriceEventListener(item){
  var quantity = document.getElementById(item.name+"-quantity");
  var totalPrice = document.getElementById(item.name+"-total-price")
  quantity.addEventListener("change", function(){
    updateCartItemQuantity(item, quantity, totalPrice)
  })
}

//Changes the quantity of the item in the user's cart to reflect the quantity updated in the input field 
function updateCartItemQuantity(item, quantity, totalPrice){
  cart.map(function (cartItem){
    if(cartItem.name = item.name){
      item.quantity = quantity.value
      totalPrice.innerHTML = "$"+(item.quantity*item.price).toFixed(2)+""      
    }
  })
}


