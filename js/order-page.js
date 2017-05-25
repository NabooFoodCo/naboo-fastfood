$(document).ready(function(){
    console.log("MENU PAGE");
    var numItems = 1;
    //Variables
    var greens = document.getElementById("greens"),
        meats = document.getElementById("meats"),
        seafood = document.getElementById("seafood"),
        bakedGoods = document.getElementById("bakedGoods"),
        mollusksBugs = document.getElementById("mollusksBugs"),
        drinks = document.getElementById("drinks"),
        
        category = document.getElementById("category"),
        container = document.getElementById("container"),
        
        gDiv = document.getElementById("gDiv"),
        mDiv = document.getElementById("mDiv"),
        sDiv = document.getElementById("sDiv"),
        bgDiv = document.getElementById("bgDiv"),
        mbDiv = document.getElementById("mbDiv"),
        dDiv = document.getElementById("dDiv"),
        
        cart = document.getElementById("cart"),
        blankDiv = document.getElementById("blankDiv"),
        cartSection = document.getElementById("cartSection"),
        backButton = document.getElementById("backButton");
    
    //Arrays (for different food categories)
    var gArray = [],
        mArray = [],
        sArray = [],
        bgArray = [],
        mbArray = [],
        dArray = [];
    
    var items = [greens,meats,seafood,bakedGoods,mollusksBugs,drinks];
    
    //This is for the shopping cart it stores what the user has bought;
    var itemPrices = {};
    var finalItems = {};
    var maxItems = 10;
    var maxPerItem = 6;
    
    //This Function makes the selected menu "glow/highlighted" when it's selected
    var active;
    function glow(active){
        for(var i=0;items.length>i;i++){
            if(items[i]==active){
                items[i].style.height = "60px";
                items[i].style.fontSize = "19px";
                items[i].style.background = "linear-gradient(rgba(0,0,0,.9),rgba(0,0,0,0))";
            } else {
                items[i].style.height = "50px";
                items[i].style.fontSize = "14px";
                items[i].style.background = "linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,0))";
            }
        }
    }
    
    //This function adds a counter to every food item and is called while creating in the ajax calls
    function counterCreator(parentDiv){
        var counterDiv = document.createElement("div");
        counterDiv.className = "counterDiv";
        parentDiv.appendChild(counterDiv);

        var Minus = document.createElement("img");
        Minus.classList.add("Minus");
        Minus.id="Minus"+numItems;
        Minus.src = "/pics/minus.png";
        counterDiv.appendChild(Minus);

        var Counter = document.createElement("div");
        Counter.className = "Counter";
        Counter.Id = "counter";
        Counter.innerHTML = "0";
        counterDiv.appendChild(Counter);
        
        var Plus = document.createElement("img");
        Plus.classList.add("Plus");
        Plus.id="Plus"+numItems;
        Plus.src = "/pics/plus.png";
        counterDiv.appendChild(Plus);
        
        Plus.addEventListener("click", function(){
            var initialValue = parseInt(this.parentNode.childNodes[1].innerHTML);
            if(initialValue != maxPerItem){
                this.parentNode.childNodes[1].innerHTML = initialValue + 1;
            }
            else {
                alert("COUNTER CAN'T GO ABOVE 6.");
            }
        });

        Minus.addEventListener("click", function(){
            var initialValue = parseInt(this.parentNode.childNodes[1].innerHTML);
            if(initialValue != 0){
                this.parentNode.childNodes[1].innerHTML = initialValue - 1;
            } else {
                alert("COUNTER CAN'T GO BELOW 0.");
            }
        });

        var add2Cart = document.createElement("button");
        add2Cart.className = "add2Cart";
        add2Cart.id="add2Cart"+numItems;
        add2Cart.innerHTML = "Add To Cart";
        counterDiv.appendChild(add2Cart);
        add2Cart.addEventListener("click",function(){
            var quantity = parseInt(this.parentNode.childNodes[1].innerHTML);
            var currentTotalItems = 0;
            Object.keys(finalItems).forEach(function(key){
                currentTotalItems += finalItems[key];
            });
            console.log(currentTotalItems);
            console.log(finalItems);
            var itemName = this.parentNode.parentNode.childNodes[0].innerHTML;
            var cost = parseInt(this.parentNode.parentNode.childNodes[2].innerHTML);
            var purchaseItem = document.createElement("div");
            var list = document.getElementById("ordersList");
            var exists = false;
            var itself = this;
            var currentTotal = document.getElementById("total");
            if (quantity != 0){
                for(i=0; i<list.childNodes.length;i++){
                    if (list.childNodes[i].className==itemName){
                        exists = true;
                    }
                }
                if (!exists){
                    if ((currentTotalItems + quantity) > maxItems){
                        alert("TOO MANY ITEMS YOU MAY ONLY ORDER " + (maxItems-currentTotalItems) + " MORE")
                    }
                    else{
                        this.innerHTML = "update cart";
                        purchaseItem.className = itemName;
                        currentTotal.innerHTML = (parseInt(currentTotal.innerHTML) + (quantity*cost));
                        purchaseItem.innerHTML = itemName + ": " + quantity + " @ " + cost + "IC each: " + (cost*quantity) + "IC";
                        var removeItem = document.createElement("button");
                        removeItem.innerHTML = "X";
                        removeItem.className = "removeItem";
                        removeItem.addEventListener("click",function(){
                            this.parentNode.remove();
                            delete finalItems[itemName];
                            itself.innerHTML = "Add to cart";
                            itself.parentNode.childNodes[1].innerHTML = 0;
                            totalCost();
                        })
                    purchaseItem.appendChild(removeItem);
                    list.appendChild(purchaseItem);
                    finalItems[itemName] =  parseInt(quantity);
                    totalCost();    
                    }
                }
                else {
                    var quantChange = 0;
                    quantChange = quantity - finalItems[itemName];
                    if((currentTotalItems + quantChange) > maxItems){
                        alert("TOO MANY ITEMS YOU MAY ONLY ORDER " + (10-currentTotalItems) + " MORE")
                    }
                    else{
                        for(i=0; i<list.childNodes.length;i++){
                            if (list.childNodes[i].className==itemName){
                                list.childNodes[i].innerHTML = itemName + ": " + quantity + " @ " + cost + "IC each: " + (cost*quantity) + "IC";
                                var removeItem = document.createElement("button");
                                removeItem.innerHTML = "X";
                                removeItem.className = "removeItem";
                                removeItem.addEventListener("click",function(){
                                    this.parentNode.remove();
                                    delete finalItems[itemName];
                                    itself.innerHTML = "Add to cart";
                                    itself.parentNode.childNodes[1].innerHTML = 0;
                                    totalCost();
                                })
                            list.childNodes[i].appendChild(removeItem);
                            }
                        finalItems[itemName] =  parseInt(quantity);
                        totalCost();
                        }
                    }
                }
            }
            else {
                var update = false;
                for(i=0; i<list.childNodes.length;i++){
                    if (list.childNodes[i].className==itemName){
                        list.childNodes[i].remove();
                        this.innerHTML = "Add to cart";
                        update = true;
                        delete finalItems[itemName];
                        totalCost();
                    }
                }
                if (update == false){
                alert("Enter amount you would like to order");
                }
            }
        })
        numItems+=1;
    }
    
    // this function is to update the total cost of order
    
    function totalCost(){
        var total = 0;
        Object.keys(finalItems).forEach(function(key){
            total += itemPrices[key] * finalItems[key];
        })
        document.getElementById("total").innerHTML = total+" IC";
    }
    
    //Storing info into each array
    //And then into different divs
    function ajaxCalls(div, array){
        for(var j=0;array.length>j;j++){
            var newDiv = document.createElement("div");
            newDiv.className = "newDiv";
            div.appendChild(newDiv);

            var newTitle = document.createElement("div");
            newTitle.innerHTML = array[j].item;
            newTitle.className = "newTitle";
            newDiv.appendChild(newTitle);

            var newImg = document.createElement("img");
            newImg.src = array[j].img;
            newImg.className = "newImg";
            newDiv.appendChild(newImg);

            var newPrice = document.createElement("div");
            newPrice.innerHTML = array[j].price;
            newPrice.className = "newPrice";
            newDiv.appendChild(newPrice);

            var newPriceC = document.createElement("div");
            newPriceC.innerHTML = " IC";
            newPriceC.className = "newPriceC";
            newDiv.appendChild(newPriceC);
            
            itemPrices[array[j].item] = parseInt(array[j].price);
            //Calling the "counterCreator" function
            counterCreator(newDiv);
        }
    }
    
    cart.addEventListener("click", function(){
        cartSection.style.right = "0";
        blankDiv.style.left = "0";
    });
    backButton.addEventListener("click", function(){
        cartSection.style.right = "-30%";
        blankDiv.style.left = "-100%";
    });
    
    //This ajax call stores all the food item's information into the divs as the page is loaded

    $.ajax({
        url: "/menu/items",
        type: "post",
        success: function(resp){
            if(resp.status == "success"){
                var arr = resp.Array;
                
                for(var i=0;arr.length>i;i++){
                    if(arr[i].type == "greens"){
                        gArray.push(arr[i]);
                    }
                    if(arr[i].type == "meats"){
                        mArray.push(arr[i]);
                    }
                    if(arr[i].type == "seafood"){
                        sArray.push(arr[i]);
                    }
                    if(arr[i].type == "bakedgoods"){
                        bgArray.push(arr[i]);
                    }
                    if(arr[i].type == "m&b"){
                        mbArray.push(arr[i]);
                    }
                    if(arr[i].type == "drinks"){
                        dArray.push(arr[i]);
                    }
                }
                
                //Calling the "ajaxCalls" function
                ajaxCalls(gDiv, gArray);
                ajaxCalls(mDiv, mArray);
                ajaxCalls(sDiv, sArray);
                ajaxCalls(bgDiv, bgArray);
                ajaxCalls(mbDiv, mbArray);
                ajaxCalls(dDiv, dArray);
            }
        }
    });
    var regExS = /^[a-z ]{2,25}$/i
    document.getElementById("checkout").addEventListener("click",function(){
        var name = document.getElementById("cusName");
        var totalCost = parseInt(document.getElementById("total").innerHTML);
        console.log(totalCost);
        if(regExS.test(name.value) == true && (document.getElementById("ordersList").childNodes.length >0)){
            $.ajax({
                url:"/menu/order",
                type:"post",
                data:{
                    order:finalItems,
                    cusName:name.value,
                    totalCost:totalCost
                },
                success:function(resp){
                    if(resp.status == "success"){
                        alert("Order has been made");
                        location.href = "/main-page";
                    }
                    else if (resp.status == "Full"){
                        alert("TOO MANY ORDERS CURRENTLY PLEASE WAIT AND TRY AGAIN");
                    }
                    else if (resp.status=="badOrder"){
                        alert("THIS ORDER IS INVALID");
                    }
                    else {
                        alert("error making order");
                    }
                }
            })
        }
        else {
            if(regExS.test(name.value) != true){
            alert("Please enter a name between 2 and 25 characters");
            }
            else{
                alert("Your checkout is empty");
            }
        }
    })
    greens.addEventListener("click", function(){
        
        //Calling the glow function for each "on click"
        active = greens;
        glow(active);
        
        category.innerHTML = "Greens";
        
        //Since the only one div can be shown at a time, the others must be made hidden "on click" of each category
        gDiv.style.display = "inline";
        mDiv.style.display = "none";
        sDiv.style.display = "none";
        bgDiv.style.display = "none";
        mbDiv.style.display = "none";
        dDiv.style.display = "none";
    });
    meats.addEventListener("click", function(){
        
        active = meats;
        glow(active);
        
        category.innerHTML = "Meats";
        
        gDiv.style.display = "none";
        mDiv.style.display = "inline";
        sDiv.style.display = "none";
        bgDiv.style.display = "none";
        mbDiv.style.display = "none";
        dDiv.style.display = "none";
    });
    seafood.addEventListener("click", function(){
        
        active = seafood;
        glow(active);
        
        category.innerHTML = "Seafood";
        
        gDiv.style.display = "none";
        mDiv.style.display = "none";
        sDiv.style.display = "inline";
        bgDiv.style.display = "none";
        mbDiv.style.display = "none";
        dDiv.style.display = "none";
    });
    bakedGoods.addEventListener("click", function(){
        
        active = bakedGoods;
        glow(active);
        
        category.innerHTML = "Baked Goods";
        
        gDiv.style.display = "none";
        mDiv.style.display = "none";
        sDiv.style.display = "none";
        bgDiv.style.display = "inline";
        mbDiv.style.display = "none";
        dDiv.style.display = "none";
    });
    mollusksBugs.addEventListener("click", function(){
        
        active = mollusksBugs;
        glow(active);
        
        category.innerHTML = "Mollusks & Bugs";
        
        gDiv.style.display = "none";
        mDiv.style.display = "none";
        sDiv.style.display = "none";
        bgDiv.style.display = "none";
        mbDiv.style.display = "inline";
        dDiv.style.display = "none";
    });
    drinks.addEventListener("click", function(){
        
        active = drinks;
        glow(active);
        
        category.innerHTML = "Drinks";
        
        gDiv.style.display = "none";
        mDiv.style.display = "none";
        sDiv.style.display = "none";
        bgDiv.style.display = "none";
        mbDiv.style.display = "none";
        dDiv.style.display = "inline";
    });
});
