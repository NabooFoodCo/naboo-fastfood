/**
 * Created by Keson on 2017-05-02.
 */

var prepItems = {};
var foodItems = [];
checkPrep();

$(document).ready(function () {
    $.ajax({
        url:"/checkFoodItem",
        type:"post",
        data:{status:"checkFood"},
        success:function (resp) {
            for(var i=0; i<resp.food.length;i++){
                foodItems.push(resp.food[i].item);
                var option = document.createElement("option");
                option.text =resp.food[i].item;
                option.value=resp.food[i].item;
                document.getElementById("item").add(option);
            }
        }
    });

    $.ajax({
        url:"/checkUnmakeOrder",
        type: "post",
        data:{
            status:"check"
        },
        success: function (resp) {
            if (resp.status === "success"){
                if(resp.displayStuff == "allunmake"){
                    if (Object.keys(resp.unmakeOrders).length==0){
                        var noOrder = document.createElement("div");
                        noOrder.innerHTML = "No order..."+"<br>";
                        noOrder.style.fontSize = "50px";

                        document.body.appendChild(noOrder);
                        document.getElementById("serve").style.display = "none";
                    }else {
                        showOrders(resp.unmakeOrders);
                    }

                }

                if(resp.displayStuff == "allPrep"){
                    showPrep();
                    document.getElementById("showMaking").style.display = "none";
                }

                if (resp.displayStuff == "allWasted"){
                    showBin();
                    document.getElementById("showMaking").style.display = "none";
                }
            }

        }
    });
    // var socket = io();
    //
    // // if a new order comes in, the new order will be stored into the unmakeOrder array and refresh the page
    // socket.on("newOrder", function (theOrder) {
    //     unmakeOrdersClient.add(theOrder);
    // })

})



// the function for showing all orders(the values in the unmakeOrder array) in the screen
function showOrders(unmakeOrdersClient) {
    var data = eval(unmakeOrdersClient);
    var orderWindowNum = 0;

    for (var key in data) {
        var color = "green";
        orderWindowNum++;
        if (orderWindowNum > 6){
            break;
        }
        var anOrderWindow = document.createElement("div");
        var orderDiv = document.createElement("div");
        orderDiv.innerHTML = "ORDER" + key;
        orderDiv.style.color = "red";
        anOrderWindow.appendChild(orderDiv);

        var data2 = eval(unmakeOrdersClient[key]);
        for (var key2 in data2) {

            var itemDiv = document.createElement("div");

            //user defined attribute to store the item name and the item quantity that ordered
            itemDiv.itemName = key2;
            itemDiv.orderId = key;
            itemDiv.qty = unmakeOrdersClient[key][key2];

            itemDiv.innerHTML =  unmakeOrdersClient[key][key2]+" <- "+key2;

            if(unmakeOrdersClient[key][key2] == 0){
                itemDiv.style.backgroundColor = "grey";
            }else {
                if(color =="green"){
                    itemDiv.style.backgroundColor = "green";
                    color = "yellow";
                }else if (color == "yellow"){
                    itemDiv.style.backgroundColor = "yellow";
                    color = "green";
                }
            }



            //when a certain item onclick, showing nessary info in the  bottom of the screem
            itemDiv.addEventListener("click", function () {
                // this.style.color = "red";
                document.getElementById("serve").orderId = this.orderId;
                document.getElementById("serve").itemName = this.itemName;


                var prepNum = caculatePreparedItem(this.itemName);
                document.getElementById("item").value = this.itemName;
                document.getElementById("serveItem").innerHTML = " : for "+ this.itemName + " of order" + this.orderId;
                document.getElementById("serveItem").qtyUmake = this.qty;

                document.getElementById("prepared").innerHTML = prepNum;
                document.getElementById("prepared").style.color = "red";


                if(this.qty - prepNum<=0){

                }else if(this.qty - prepNum > 2){
                    document.getElementById("quantity").value = 6;
                }else if(this.qty - prepNum == 2){
                    document.getElementById("quantity").value = 2;
                }else if(this.qty - prepNum == 1){
                    document.getElementById("quantity").value = 1;
                }

            })

            anOrderWindow.appendChild(itemDiv);
        }




        anOrderWindow.style.margin = "0 2vw 2vw 0";
        anOrderWindow.style.width = "30vw";
        anOrderWindow.style.height = "40vh";
        anOrderWindow.style.float = "left";
        anOrderWindow.style.borderStyle = "solid";
        anOrderWindow.style.borderColor = "red";
        anOrderWindow.style.overflow = "hidden";
        document.body.appendChild(anOrderWindow);

    }
}

//"MAKE" button onclick: technically add food into prepared map
document.getElementById("make").addEventListener("click", function () {
    $.ajax({
        url:"/madeFood",
        type:"post",
        data:{
            status:"make",
            foodName:document.getElementById("item").value,
            quantity:document.getElementById("quantity").value
        },
        success:function (resp) {
            if(resp.status ==="success"){
                making = resp.making;
                for(var i =0; i<making.length;i++) {
                    prepItems[making[i]] = document.getElementById("item").value;
                }
                var alterMaking = document.getElementById("alterMaking");
                var making = document.getElementById("making");
                var makingImg = document.getElementById("makingImg");


                makingImg.src = "/pics/making.gif";
                makingImg.style.marginLeft="auto";
                makingImg.style.marginRight = "auto";
                alterMaking.innerHTML = "MAKING...";
                alterMaking.style.fontSize="50px";

                making.style.zIndex = 99;
                making.style.backgroundColor="pink";
                setTimeout(function () {
                    alterMaking.innerHTML="";
                    makingImg.removeAttribute("src");
                    making.style.backgroundColor="transparent";
                    making.style.zIndex=-99;
                    document.getElementById("prepared").innerHTML=caculatePreparedItem(document.getElementById("item").value);
                },3000);
            }
        }
    });

})


//"SERVE" button onclick: technically delete items from unmakeOrder map
document.getElementById("serve").addEventListener("click", function () {
    var orderId=this.orderId;
    var itemName = this.itemName;
    $.ajax({
        url:"/checkUnmakeOrder",
        type: "post",
        data:{
            status:"check"
        },
        success: function (resp) {
            if (resp.status === "success"){
                caculatePreparedItem(itemName);
                if(caculatePreparedItem(itemName)-resp.unmakeOrders[orderId][itemName]>=0){
                    updateUnmake(0,orderId,itemName);
                    updatePrep(document.getElementById("serveItem").qtyUmake,itemName);
                    location.reload();
                }else {
                    updateUnmake(resp.unmakeOrders[orderId][itemName]-caculatePreparedItem(itemName),orderId,itemName);
                    updatePrep(caculatePreparedItem(itemName),itemName);
                    location.reload();
                }

            }

        }
    });

})

document.getElementById("allunmake").addEventListener("click", function () {
    $.ajax({
        url:"/setType",
        type:"post",
        data:{
            status:"set",
            displayStuff:"allunmake"

        },
        success: function (resp) {

        }
    });
    location.reload();
});

document.getElementById("allPrep").addEventListener("click", function () {
    $.ajax({
        url:"/setType",
        type:"post",
        data:{
            status:"set",
            displayStuff:"allPrep"

        },
        success: function (resp) {

        }
    });
    location.reload();
});

document.getElementById("allWasted").addEventListener("click", function () {
    $.ajax({
        url:"/setType",
        type:"post",
        data:{
            status:"set",
            displayStuff:"allWasted"

        },
        success: function (resp) {

        }
    });
    location.reload();
});

function updateUnmake(numOfFood,key1,key2) {
    $.ajax({
        url:"/updateUnmake",
        type:"post",
        data:{
            status:"served",
            key1:key1,
            key2:key2,
            numOfFood:numOfFood
        },
        success: function (resp) {
            if (resp.status == "success"){
                // location.reload();
            }

        }
    });
}

function updatePrep(numToRemove,food) {
    $.ajax({
        url:"/updatePrep",
        type:"post",
        data:{
            status:"served",
            food:food,
            numToRemove:numToRemove
        },
        success: function (resp) {
            if (resp.status == "success"){
                // location.reload();
            }

        }
    });
}
function updatebin(numToRemove,food) {
    $.ajax({
        url:"/updatebin",
        type:"post",
        data:{
            status:"throw",
            food:food,
            numToRemove:numToRemove
        },
        success: function (resp) {
            if (resp.status == "success"){
                // location.reload();
            }

        }
    });
}

function checkPrep() {
    $.ajax({
        url: "/checkPrep",
        type: "post",
        data:{
            status:"check"
        },
        success:function (resp) {
            prepItems = resp.prepItems;
        }
    })
}


// caculate the quantity of a certain food in prepared
function caculatePreparedItem(food) {
    var foodQty =0;
    var keys = Object.keys(prepItems);
    keys.forEach(function (key) {
        if(prepItems[key] == food){
            foodQty++;
        }
    });
    return foodQty;

}


//check the prepared items every one second and remove those items that been made longer than 5 minutes
setInterval(function() {

    // checkPrep();
    var times = Object.keys(prepItems);

    times.forEach(function(time) {
        if(Date.now()-time>=300000) {
            updatebin(1,prepItems[time]);
        }
    });
    location.reload();

}, 30000);

function showBin(){
    $.ajax({
        url: "/checkBin",
        type: "post",
        data:{
            status:"check"
        },
        success:function (resp) {
            for (var i=0;i<foodItems.length;i++){
                var foodQty =0;
                var foodName =foodItems[i];
                var keys = Object.keys(resp.binnedItems);
                keys.forEach(function (key) {
                    if(resp.binnedItems[key] == foodName){
                        foodQty++;
                    }
                });

                var anItem = document.createElement("div");
                anItem.innerHTML = foodName+" : "+ foodQty +"<br>";

                document.body.appendChild(anItem);
            }
        }
    })

}

function showPrep() {
    $.ajax({
        url: "/checkPrep",
        type: "post",
        data:{
            status:"check"
        },
        success:function (resp) {
            for (var i=0;i<foodItems.length;i++){
                var foodQty =0;
                var foodName =foodItems[i];
                var keys = Object.keys(resp.prepItems);
                keys.forEach(function (key) {
                    if(resp.prepItems[key] == foodName){
                        foodQty++;
                    }
                });

                var anItem = document.createElement("div");
                anItem.innerHTML = foodName+" : "+ foodQty +"<br>";

                document.body.appendChild(anItem);
            }
        }
    })

}
setInterval(function() {

    $.ajax({
        url: "/checkOrderChange",
        type: "post",
        data:{
            status:"check"
        },
        success:function (resp) {
            if(resp.orderBefore != resp.orderAfter){
                location.reload();
            }
        }
    })

}, 1000);

