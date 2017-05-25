var addItemButton = document.getElementById("addItemButton"),
    removeItemButton = document.getElementById("removeItemButton"),
    editItemButton = document.getElementById("editItemButton"),
    addEmployeeButton = document.getElementById("addEmployeeButton"),
    removeEmployeeButton = document.getElementById("removeEmployeeButton"),
    editEmployeeButton = document.getElementById("editEmployeeButton"),
    addItemDiv = document.getElementById("addItemDiv"),
    removeItemDiv = document.getElementById("removeItemDiv"),
    editItemDiv = document.getElementById("editItemDiv"),
    addEmployeeDiv = document.getElementById("addEmployeeDiv"),
    removeEmployeeDiv = document.getElementById("removeEmployeeDiv"),
    editEmployeeDiv = document.getElementById("editEmployeeDiv"),
    addItemNameInput = document.getElementById("addItemNameInput"),
    addItemPriceInput = document.getElementById("addItemPriceInput"),
    addItemImgInput = document.getElementById("addItemImgInput"),
    selectItemTypeList = document.getElementById("selectItemTypeList"),
    addItemSave = document.getElementById("addItemSave"),
    removeItemList = document.getElementById("removeItemList"),
    removeItemSave = document.getElementById("removeItemSave"),
    editItemList = document.getElementById("editItemList"),
    editItemNameInput = document.getElementById("editItemNameInput"),
    editItemPriceInput = document.getElementById("editItemPriceInput"),
    editItemImgInput = document.getElementById("editItemImgInput"),
    editItemTypeList = document.getElementById("editItemTypeList"),
    editItemSave = document.getElementById("editItemSave"),
    addEmployeeNameInput = document.getElementById("addEmployeeNameInput"),
    addEmployeeIdInput = document.getElementById("addEmployeeIdInput"),
    selectPositionList = document.getElementById("selectPositionList"),
    addEmployeePasswordInput = document.getElementById("addEmployeePasswordInput"),
    addEmployeeSave = document.getElementById("addEmployeeSave"),
    removeEmployeeList = document.getElementById("removeEmployeeList"),
    removeEmployeeSave = document.getElementById("removeEmployeeSave"),
    editEmployeeList = document.getElementById("editEmployeeList"),
    editEmployeeNameInput = document.getElementById("editEmployeeNameInput"),
    editEmployeeIdInput = document.getElementById("editEmployeeIdInput"),
    editEmployeePositionList = document.getElementById("editEmployeePositionList"),
    editEmployeePasswordInput = document.getElementById("editEmployeePasswordInput"),
    editEmployeeSave = document.getElementById("editEmployeeSave"),
    openStoreButton = document.getElementById("openStoreButton"),
    closeStoreButton = document.getElementById("closeStoreButton"),
    employeeName = document.getElementById("employeeName"),
    employeeId = document.getElementById("employeeId"),
    logoutButton = document.getElementById("logoutButton"),
    checkItemsSoldButton = document.getElementById("checkItemsSoldButton"),
    adminSettingsDiv = document.getElementById("adminSettingsDiv"),
    checkItemsSoldDiv = document.getElementById("checkItemsSoldDiv"),
    datesList = document.getElementById("datesList"),
    checkButton = document.getElementById("checkButton"),
    searchBar = document.getElementById("searchBar"),
    searchDate = document.getElementById("searchDate"),
    displayTable = document.getElementById("displayTable"),
    checkSalesButton = document.getElementById("checkSalesButton"),
    checkSalesDiv = document.getElementById("checkSalesDiv"),
    datesListSales = document.getElementById("datesListSales"),
    checkSales = document.getElementById("checkSales"),
    searchBarSales = document.getElementById("searchBarSales"),
    searchDateSales = document.getElementById("searchDateSales"),
    displayTableSales = document.getElementById("displayTableSales"),
    displayTotalSales = document.getElementById("displayTotalSales"),
    displayTotalOrders = document.getElementById("displayTotalOrders"),
    regExNames = /^[a-zA-Z ]{3,50}$/,
    regExURL = /\.(jpg|png|gif)$/,
    regExPrice = /^[1-9][0-9]{1,3}$/,
    regExEmpId = /^[A][0-9]{1,3}$/,
    regExPassword = /^[a-zA-Z0-9]{5,50}$/
;
//***********************FUNCTIONS******************************//
function regExTest(regEx, input){
    if(regEx.test(input)){
        return true;
    }
    return false;
}

//***********************SETTING DISPLAY DIV******************************//

addItemButton.addEventListener("click", function(){
    addItemDiv.style.display = "block";
    removeItemDiv.style.display = "none";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "none";
    editEmployeeDiv.style.display = "none";
    checkItemsSoldDiv.style.display = "none";
    checkSalesDiv.style.display = "none";
    adminSettingsDiv.style.display = "none";

    //change active buttons from nav bar
    checkSalesButton.style.textShadow = "";
    checkItemsSoldButton.style.textShadow = "";
});

removeItemButton.addEventListener("click", function(){
    addItemDiv.style.display = "none";
    removeItemDiv.style.display = "block";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "none";
    editEmployeeDiv.style.display = "none";
    checkItemsSoldDiv.style.display = "none";
    adminSettingsDiv.style.display = "none";
    checkSalesDiv.style.display = "none";

    //change active buttons from nav bar
    checkSalesButton.style.textShadow = "";
    checkItemsSoldButton.style.textShadow = "";

    //*****************************DROP DOWN LIST**********************************//

    removeItemList.innerHTML = "";
    //ajax to the server, get the item names and display it to the dropdown list
    $.ajax({
        url:"/get-items",
        type:"post",
        success:function(resp){
            if(resp.status == "Success"){
                var foodItems = JSON.parse(resp.items);

                for(i=0;i<foodItems.length;i++){
                    var food = document.createElement("option");
                    food.value = foodItems[i].item;
                    food.textContent = foodItems[i].item;
                    removeItemList.appendChild(food);
                }
            }
        }
    })
});

editItemButton.addEventListener("click", function(){
    addItemDiv.style.display = "none";
    removeItemDiv.style.display = "none";
    editItemDiv.style.display = "block";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "none";
    editEmployeeDiv.style.display = "none";
    checkItemsSoldDiv.style.display = "none";
    adminSettingsDiv.style.display = "none";
    checkSalesDiv.style.display = "none";

    //change active buttons from nav bar
    checkSalesButton.style.textShadow = "";
    checkItemsSoldButton.style.textShadow = "";

    //*****************************DROP DOWN LIST**********************************//

    editItemList.innerHTML = "";
    //ajax to the server, get the item names and display it to the dropdown list
    $.ajax({
        url:"/get-items",
        type:"post",
        success:function(resp){
            if(resp.status == "Success"){
                var foodItems = JSON.parse(resp.items);

                var chooseItem = document.createElement("option");
                chooseItem.value = "choose";
                chooseItem.textContent = "Choose item";
                editItemList.appendChild(chooseItem);

                editItemNameInput.value = "";
                editItemPriceInput.value = "";
                editItemImgInput.value = "";
                editItemTypeList.value = "";

                for(i=0;i<foodItems.length;i++){
                    var food = document.createElement("option");
                    food.value = foodItems[i].item;
                    food.textContent = foodItems[i].item;
                    editItemList.appendChild(food);
                }
            }
        }
    })
});

addEmployeeButton.addEventListener("click", function(){
    addItemDiv.style.display = "none";
    removeItemDiv.style.display = "none";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "block";
    removeEmployeeDiv.style.display = "none";
    editEmployeeDiv.style.display = "none";
    checkItemsSoldDiv.style.display = "none";
    adminSettingsDiv.style.display = "none";
    checkSalesDiv.style.display = "none";

    //change active buttons from nav bar
    checkSalesButton.style.textShadow = "";
    checkItemsSoldButton.style.textShadow = "";
});

removeEmployeeButton.addEventListener("click", function(){
    addItemDiv.style.display = "none";
    removeItemDiv.style.display = "none";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "block";
    editEmployeeDiv.style.display = "none";
    checkItemsSoldDiv.style.display = "none";
    adminSettingsDiv.style.display = "none";
    checkSalesDiv.style.display = "none";

    //change active buttons from nav bar
    checkSalesButton.style.textShadow = "";
    checkItemsSoldButton.style.textShadow = "";

    //*****************************DROP DOWN LIST**********************************//

    removeEmployeeList.innerHTML = "";
    //ajax to the server, get the employee names and display it to the dropdown list
    $.ajax({
        url:"/get-employees",
        type:"post",
        success:function(resp){
            if(resp.status == "Success"){
                console.log(resp.users);
                var employees = resp.users;

                for(i=0;i<employees.length;i++){
                    var employeeName = document.createElement("option");
                    employeeName.value = employees[i].name;
                    employeeName.textContent = employees[i].name;
                    removeEmployeeList.appendChild(employeeName);
                }
            }
        }
    })
});

editEmployeeButton.addEventListener("click", function(){
    addItemDiv.style.display = "none";
    removeItemDiv.style.display = "none";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "none";
    editEmployeeDiv.style.display = "block";
    checkItemsSoldDiv.style.display = "none";
    adminSettingsDiv.style.display = "none";
    checkSalesDiv.style.display = "none";

    //change active buttons from nav bar
    checkSalesButton.style.textShadow = "";
    checkItemsSoldButton.style.textShadow = "";

    //*****************************DROP DOWN LIST**********************************//

    editEmployeeList.innerHTML = "";
    //ajax to the server, get the employee names and display it to the dropdown list
    $.ajax({
        url:"/get-employees",
        type:"post",
        success:function(resp){
            if(resp.status == "Success"){
                console.log(resp.users);
                var employees = JSON.parse(resp.users);

                var chooseEmployee = document.createElement("option");
                chooseEmployee.value = "choose";
                chooseEmployee.textContent = "Choose employee";
                editEmployeeList.appendChild(chooseEmployee);

                editEmployeeNameInput.value = "";
                editEmployeeIdInput.value = "";
                editEmployeePasswordInput.value = "";

                for(i=0;i<employees.length;i++){
                    var employeeName = document.createElement("option");
                    employeeName.value = employees[i].name;
                    employeeName.textContent = employees[i].name;
                    editEmployeeList.appendChild(employeeName);
                }
            }
        }
    })

});

checkItemsSoldButton.addEventListener("click", function(){
    addItemDiv.style.display = "none";
    removeItemDiv.style.display = "none";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "none";
    editEmployeeDiv.style.display = "none";
    adminSettingsDiv.style.display = "none";
    checkItemsSoldDiv.style.display = "block";
    checkSalesDiv.style.display = "none";

    //set text to active
    checkSalesButton.style.textShadow = "";
    checkItemsSoldButton.style.textShadow = "0 0 3px limegreen";


    //ajax to server to get the dates from the db
    datesList.innerHTML = "";
    displayTable.innerHTML = "";
    $.ajax({
        url:"/get-dates",
        type:"post",
        success:function(resp){
            if(resp.status == "Success"){
                console.log(resp.dates);
                var datesAvailable = resp.dates;
                for(i=0;i<datesAvailable.length;i++){
                    var newDate = document.createElement("option");
                    newDate.value = datesAvailable[i].date;
                    newDate.textContent = datesAvailable[i].date.substring(0, 10);
                    datesList.appendChild(newDate);
                }
            }
        }
    })
});

checkSalesButton.addEventListener("click", function(){
    addItemDiv.style.display = "none";
    removeItemDiv.style.display = "none";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "none";
    editEmployeeDiv.style.display = "none";
    adminSettingsDiv.style.display = "none";
    checkItemsSoldDiv.style.display = "none";
    checkSalesDiv.style.display = "block";

    checkSalesButton.style.textShadow = "0 0 3px limegreen";
    checkItemsSoldButton.style.textShadow = "";

    //ajax to server to get the dates from the db
    datesListSales.innerHTML = "";
    displayTableSales.innerHTML = "";
    displayTotalSales.innerHTML = "";
    displayTotalOrders.innerHTML = "";
    $.ajax({
        url:"/get-dates-sales",
        type:"post",
        success:function(resp){
            if(resp.status == "Success"){
                console.log(resp.dates);
                var datesAvailable = resp.dates;
                for(i=0;i<datesAvailable.length;i++){
                    var newDate = document.createElement("option");
                    newDate.value = datesAvailable[i].date;
                    newDate.textContent = datesAvailable[i].date.substring(0, 10);
                    datesListSales.appendChild(newDate);
                }
            }
        }
    })
});

//*******************************PAGE RELOAD************************************//
//ajax to the server and display the info of the admin that is logged in to the admin-page

$(document).ready(function(){
    $.ajax({
        url:"/get-user",
        type:"post",
        success:function(resp){
            if(resp.status == "Success"){
                console.log(resp.user);
                var admin = JSON.parse(resp.user);

                //change values for employeeName and employeeId
                employeeName.innerHTML = "Signed in as " + admin.name.toUpperCase();

                if(resp.store){
                    openStoreButton.disabled = true;
                    closeStoreButton.disabled = false;
                } else {
                    openStoreButton.disabled = false;
                    closeStoreButton.disabled = true;
                }
            }
        }
    })

});



//**************************ITEMS SOLD DIV******************************//
checkButton.addEventListener("click", function(){
    displayTable.innerHTML = "";
    $.ajax({
        url:"/get-items-sold",
        type:"post",
        data:{
            date_selected: datesList.value,
            type: "check"
        },
        success:function(resp){
            if(resp.status = "Success"){
                console.log(resp);
                $("#checkItemsSuccess").show().delay(3000).fadeOut();
                var tableValues = resp.sales;

                //create the elements
                var salesTable = document.createElement("table");
                salesTable.className = "table table-striped";
                var header = document.createElement("thead");
                var headerRow = document.createElement("tr");
                var itemName = document.createElement("th");
                var itemQuantity = document.createElement("th");
                var tableBody = document.createElement("tbody");

                //set the header values
                itemName.innerHTML = "Item Name";
                itemQuantity.innerHTML = "Quantity";


                //append to parent
                displayTable.appendChild(salesTable);
                salesTable.appendChild(header);
                salesTable.appendChild(tableBody);
                header.appendChild(headerRow);
                headerRow.appendChild(itemName);
                headerRow.appendChild(itemQuantity);

                for(i=0;i<tableValues.length;i++){
                    //create the elements
                    var newRow = document.createElement("tr");
                    var item = document.createElement("td");
                    var qty = document.createElement("td");

                    //set the values
                    item.innerHTML = tableValues[i].item;
                    qty.innerHTML = tableValues[i].qty;

                    //append to parent
                    newRow.appendChild(item);
                    newRow.appendChild(qty);
                    tableBody.appendChild(newRow);
                }
            }
        }
    })
});

//Change the DDL value for date searched
searchDate.addEventListener("click", function(){
    var dateExists = false;
    for(i=0;i<datesList.length;i++){
        if(searchBar.value == datesList.options[i].text){
            dateExists = true;
            datesList.options[i].selected = true;
        }
    }

    if(!dateExists){
        $("#checkItemsFailed").show().delay(3000).fadeOut();
    }

});

//**************************SALES DIV******************************//
checkSales.addEventListener("click", function(){
    displayTableSales.innerHTML = "";
    $.ajax({
        url:"/get-sales",
        type:"post",
        data:{
            date_selected: datesListSales.value,
            type: "check"
        },
        success:function(resp){
            if(resp.status = "Success"){
                console.log(resp);
                $("#checkSalesSuccess").show().delay(3000).fadeOut();
                var tableValues = resp.sales;
                var totalSales = 0;
                var totalOrders = 0;

                //create the elements
                var salesTable = document.createElement("table");
                salesTable.className = "table table-striped";
                var header = document.createElement("thead");
                var headerRow = document.createElement("tr");
                var orderNumberHeader = document.createElement("th");
                var priceHeader = document.createElement("th");
                var tableBody = document.createElement("tbody");

                //set the header values
                orderNumberHeader.innerHTML = "Order No.";
                priceHeader.innerHTML = "Price";


                //append to parent
                displayTableSales.appendChild(salesTable);
                salesTable.appendChild(header);
                salesTable.appendChild(tableBody);
                header.appendChild(headerRow);
                headerRow.appendChild(orderNumberHeader);
                headerRow.appendChild(priceHeader);

                for(i=0;i<tableValues.length;i++){
                    //create the elements
                    var newRow = document.createElement("tr");
                    var orderNumber = document.createElement("td");
                    var price = document.createElement("td");

                    //set the values
                    orderNumber.innerHTML = tableValues[i].id;
                    price.innerHTML = tableValues[i].totalprice;

                    //append to sales
                    totalSales += tableValues[i].totalprice;
                    totalOrders ++;

                    //append to parent
                    newRow.appendChild(orderNumber);
                    newRow.appendChild(price);
                    tableBody.appendChild(newRow);
                }
                displayTotalSales.innerHTML = "Total Sales: $" + totalSales;
                displayTotalOrders.innerHTML = "Total Orders: " + totalOrders;
            }
        }
    })
});

//Change the DDL value for date searched
searchDateSales.addEventListener("click", function(){
    var dateExists = false;
    for(i=0;i<datesListSales.length;i++){
        if(searchBarSales.value == datesListSales.options[i].text){
            dateExists = true;
            datesListSales.options[i].selected = true;
        }
    }

    if(!dateExists) {
        $("#checkSalesFailed").show().delay(3000).fadeOut();
    }
});


//**************************ADD ITEM******************************//

addItemNameInput.onkeyup = function(){
    if(!regExTest(regExNames, addItemNameInput.value)){
        addItemNameInput.style.backgroundColor = '#F5A9A9'
    }else{
        addItemNameInput.style.backgroundColor = '#FFFFFF'
    }
}

addItemPriceInput.onkeyup  = function(){
    if(!regExTest(regExPrice, addItemPriceInput.value)){
        addItemPriceInput.style.backgroundColor = '#F5A9A9'
    }else{
        addItemPriceInput.style.backgroundColor = '#FFFFFF'
    }
}

addItemImgInput.onkeyup  = function(){
    if(!regExTest(regExURL, addItemImgInput.value)){
        addItemImgInput.style.backgroundColor = '#F5A9A9'
    } else{
        addItemImgInput.style.backgroundColor = '#FFFFFF'
    }
}

addItemSave.addEventListener("click", function(){
    if(!regExTest(regExNames, addItemNameInput.value)||!regExTest(regExPrice, addItemPriceInput.value)||!regExTest(regExURL, addItemImgInput.value)){
        $("#addItemFailed").show().delay(3000).fadeOut();
    } else {
        $.ajax({
            url:"/add-item",
            type:"post",
            data:{
                item_name: addItemNameInput.value,
                item_price: addItemPriceInput.value,
                item_img: addItemImgInput.value,
                item_type: selectItemTypeList.value,
                type: "create"
            },
            success:function(resp){
                console.log(resp);
                addItemNameInput.value = "";
                addItemPriceInput.value = "";
                addItemImgInput.value = "";
                selectItemTypeList.value = "greens"
                $("#addItemSuccess").show().delay(3000).fadeOut();
            }
        })
    }
});

//**************************REMOVE ITEM******************************//

removeItemSave.addEventListener("click", function(){

    $.ajax({
        url:"/remove-item",
        type:"post",
        data:{
            item_name: removeItemList.value,
            type: "remove"
        },
        success:function(resp){
            console.log(resp);
            removeItemList.remove(removeItemList.selectedIndex);
            $('#removeItemModal').hide();
            $('.modal-backdrop').hide();
            $("#removeItemSuccess").show().delay(3000).fadeOut();
        }
    })
});

//**************************EDIT ITEM******************************//

editItemNameInput.onkeyup = function(){
    if(!regExTest(regExNames, editItemNameInput.value)){
        editItemNameInput.style.backgroundColor = '#F5A9A9'
    }else{
        editItemNameInput.style.backgroundColor = '#FFFFFF'
    }
}

editItemPriceInput.onkeyup  = function(){
    if(!regExTest(regExPrice, editItemPriceInput.value)){
        editItemPriceInput.style.backgroundColor = '#F5A9A9'
    }else{
        editItemPriceInput.style.backgroundColor = '#FFFFFF'
    }
}

editItemImgInput.onkeyup  = function(){
    if(!regExTest(regExURL, editItemImgInput.value)){
        editItemImgInput.style.backgroundColor = '#F5A9A9'
    } else{
        editItemImgInput.style.backgroundColor = '#FFFFFF'
    }
}

editItemList.addEventListener("change", function () {

    $.ajax({
        url:"/edit-item",
        type:"post",
        data:{
            item_name: editItemList.value,
            type: "select"
        },
        success:function(resp){
            console.log(resp);
            if(resp.status == "Success"){
                var item = resp.food[0];

                if(editItemList.value == "choose"){
                    editItemNameInput.value = "";
                    editItemPriceInput.value = "";
                    editItemImgInput.value = "";
                    editItemTypeList.value = "";
                }

                editItemNameInput.value = item.item;
                editItemPriceInput.value = item.price;
                editItemImgInput.value = item.img;
                editItemTypeList.value = item.type;
            }
        }
    })
});

editItemSave.addEventListener("click", function(){

    if(!regExTest(regExNames, editItemNameInput.value)||!regExTest(regExPrice, editItemPriceInput.value)||!regExTest(regExURL, editItemImgInput.value)){
        $("#editItemFailed").show().delay(3000).fadeOut();
    } else {
        $.ajax({
            url: "/edit-item",
            type: "post",
            data: {
                old_item_name: editItemList.value,
                new_item_name: editItemNameInput.value,
                item_price: editItemPriceInput.value,
                item_img: editItemImgInput.value,
                item_type: editItemTypeList.value,
                type: "edit"
            },
            success: function (resp) {
                console.log(resp);
                $("#editItemSuccess").show().delay(3000).fadeOut();
                editItemList.value = "choose";
                editItemNameInput.value = "";
                editItemPriceInput.value = "";
                editItemImgInput.value = "";
            }
        })
    }
});

//**************************ADD EMPLOYEE******************************//
addEmployeeNameInput.onkeyup = function(){
    if(!regExTest(regExNames, addEmployeeNameInput.value)){
        addEmployeeNameInput.style.backgroundColor = '#F5A9A9'
    }else{
        addEmployeeNameInput.style.backgroundColor = '#FFFFFF'
    }
}

addEmployeeIdInput.onkeyup = function(){
    if(!regExTest(regExEmpId, addEmployeeIdInput.value)){
        addEmployeeIdInput.style.backgroundColor = '#F5A9A9'
    }else{
        addEmployeeIdInput.style.backgroundColor = '#FFFFFF'
    }
}


addEmployeePasswordInput.onkeyup = function(){
    if(!regExTest(regExPassword, addEmployeePasswordInput.value)){
        addEmployeePasswordInput.style.backgroundColor = '#F5A9A9'
    }else{
        addEmployeePasswordInput.style.backgroundColor = '#FFFFFF'
    }
}


addEmployeeSave.addEventListener("click", function(){

    if(!regExTest(regExNames, addEmployeeNameInput.value)||!regExTest(regExEmpId, addEmployeeIdInput.value)||!regExTest(regExPassword, addEmployeePasswordInput.value)){
        $("#addEmployeeFailed").show().delay(3000).fadeOut();
    } else {
        $.ajax({
            url: "/add-employee",
            type: "post",
            data: {
                name: addEmployeeNameInput.value,
                position: selectPositionList.value,
                employee_id: addEmployeeIdInput.value,
                password: addEmployeePasswordInput.value,
                type: "create"
            },
            success: function (resp) {
                console.log(resp);
                if(resp.status == "Success"){
                    $("#addEmployeeSuccess").show().delay(3000).fadeOut();
                    addEmployeeNameInput.value = "";
                    addEmployeeIdInput.value = "";
                    addEmployeePasswordInput.value = "";
                } else if(resp.status == "Failed"){
                    $("#addEmployeeExists").show().delay(3000).fadeOut();
                }
            }
        })
    }
});

//**************************REMOVE EMPLOYEE******************************//

removeEmployeeSave.addEventListener("click", function(){
    $.ajax({
        url:"/remove-employee",
        type:"post",
        data:{
            name: removeEmployeeList.value,
            type: "remove"
        },
        success:function(resp){
            console.log(resp);
            removeEmployeeList.remove(removeEmployeeList.selectedIndex);
            $('#removeEmployeeModal').hide();
            $('.modal-backdrop').hide();
            $("#removeEmployeeSuccess").show().delay(3000).fadeOut();
        }
    })
});

//**************************EDIT EMPLOYEE******************************//

editEmployeeNameInput.onkeyup = function(){
    if(!regExTest(regExNames, editEmployeeNameInput.value)){
        editEmployeeNameInput.style.backgroundColor = '#F5A9A9'
    }else{
        editEmployeeNameInput.style.backgroundColor = '#FFFFFF'
    }
}

editEmployeeIdInput.onkeyup = function(){
    if(!regExTest(regExEmpId, editEmployeeIdInput.value)){
        editEmployeeIdInput.style.backgroundColor = '#F5A9A9'
    }else{
        editEmployeeIdInput.style.backgroundColor = '#FFFFFF'
    }
}


editEmployeePasswordInput.onkeyup = function(){
    if(!regExTest(regExPassword, editEmployeePasswordInput.value)){
        editEmployeePasswordInput.style.backgroundColor = '#F5A9A9'
    }else{
        editEmployeePasswordInput.style.backgroundColor = '#FFFFFF'
    }
}

editEmployeeList.addEventListener("change", function () {
    $.ajax({
        url:"/edit-employee",
        type:"post",
        data:{
            employee_name: editEmployeeList.value,
            type: "select"
        },
        success:function(resp){
            console.log(resp);
            if(resp.status == "Success"){
                var employee = resp.user[0];

                if(editEmployeeList.value == "choose"){
                    editEmployeeNameInput.value = "";
                    editEmployeeIdInput.value = "";
                    editEmployeePasswordInput.value = "";
                }

                editEmployeeNameInput.value = employee.name;
                editEmployeeIdInput.value = employee.emp_id;
                editEmployeePositionList.value = employee.type;
                editEmployeePasswordInput.value = employee.password;

            }
        }
    })
});

editEmployeeSave.addEventListener("click", function(){

    if(!regExTest(regExNames, editEmployeeNameInput.value)||!regExTest(regExEmpId, editEmployeeIdInput.value)||!regExTest(regExPassword, editEmployeePasswordInput.value)){
        $("#editEmployeeFailed").show().delay(3000).fadeOut();
    } else {
        $.ajax({
            url: "/edit-employee",
            type: "post",
            data: {
                old_employee_name: editEmployeeList.value,
                new_employee_name: editEmployeeNameInput.value,
                employee_id: editEmployeeIdInput.value,
                emp_pos: editEmployeePositionList.value,
                pass: editEmployeePasswordInput.value,
                type: "edit"
            },
            success: function (resp) {
                console.log(resp);
                if(resp.status == "Success"){
                    $("#editEmployeeSuccess").show().delay(3000).fadeOut();
                    editEmployeeList.value = "choose"
                    editEmployeeNameInput.value = "";
                    editEmployeeIdInput.value = "";
                    editEmployeePasswordInput.value = "";
                } else if(resp.status == "Failed"){
                    $("#editEmployeeExists").show().delay(3000).fadeOut();
                }
            }
        })
    }
});

//**************************OPEN/CLOSE STORE******************************//

openStoreButton.addEventListener("click", function(){
    $.ajax({
        url:"/open-store",
        type:"post",
        success:function(resp){
            if(resp == "Success"){
                openStoreButton.disabled = true;
                closeStoreButton.disabled = false;
            }
        }
    })
});

closeStoreButton.addEventListener("click", function(){
    $.ajax({
        url:"/close-store",
        type:"post",
        success:function(resp){
            if(resp == "Success"){
                closeStoreButton.disabled = true;
                openStoreButton.disabled = false;
            }
        }
    })
});

//**************************USER LOG OUT******************************//
logoutButton.addEventListener("click", function () {
    $.ajax({
        url:"/logout",
        type:"post",
        success:function(resp){
            if(resp == "success"){
                location.reload();
            }
        }
    })
});

