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
    editEmployeePasswordInput = document.getElementById("editEmployeePasswordInput"),
    editEmployeeSave = document.getElementById("editEmployeeSave"),
    openStoreButton = document.getElementById("openStoreButton"),
    closeStoreButton = document.getElementById("closeStoreButton"),
    employeeName = document.getElementById("employeeName"),
    employeeId = document.getElementById("employeeId"),
    logoutButton = document.getElementById("logoutButton")
;

//***********************SETTING DISPLAY DIV******************************//

addItemButton.addEventListener("click", function(){
    addItemDiv.style.display = "block";
    removeItemDiv.style.display = "none";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "none";
    editEmployeeDiv.style.display = "none";
});

removeItemButton.addEventListener("click", function(){
    addItemDiv.style.display = "none";
    removeItemDiv.style.display = "block";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "none";
    editEmployeeDiv.style.display = "none";

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

    //*****************************DROP DOWN LIST**********************************//

    editItemList.innerHTML = "";
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
});

removeEmployeeButton.addEventListener("click", function(){
    addItemDiv.style.display = "none";
    removeItemDiv.style.display = "none";
    editItemDiv.style.display = "none";
    addEmployeeDiv.style.display = "none";
    removeEmployeeDiv.style.display = "block";
    editEmployeeDiv.style.display = "none";

    //*****************************DROP DOWN LIST**********************************//

    removeEmployeeList.innerHTML = "";
    //ajax to the server, get the employee names and display it to the dropdown list
    $.ajax({
        url:"/get-employees",
        type:"post",
        success:function(resp){
            if(resp.status == "Success"){
                console.log(resp.users);
                var employees = JSON.parse(resp.users);

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

//*******************************************************************//
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
            }
        }
    })

});


//**************************ADD ITEM******************************//

addItemSave.addEventListener("click", function(){
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
            $("#addItemSuccess").show().delay(3000).fadeOut();
        }
    })
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
            $("#removeItemSuccess").show().delay(3000).fadeOut();
        }
    })
});

//**************************EDIT ITEM******************************//
//TODO [Patrick] : Edit item settings still needs an image input (URL or File Upload)
//TODO [Patrick] : Ajax to the server when user selects from the ddl and put corresponding values in each of the inputs

editItemSave.addEventListener("click", function(){
    $.ajax({
        url:"/edit-item",
        type:"post",
        data:{
            old_item_name: editItemList.value,
            new_item_name: editItemNameInput.value,
            item_price: editItemPriceInput.value,
            type: "edit"
        },
        success:function(resp){
            console.log(resp);
            $("#editItemSuccess").show().delay(3000).fadeOut();
        }
    })
});

//**************************ADD EMPLOYEE******************************//

addEmployeeSave.addEventListener("click", function(){
    $.ajax({
        url:"/add-employee",
        type:"post",
        data:{
            name: addEmployeeNameInput.value,
            position: selectPositionList.value,
            employee_id: addEmployeeIdInput.value,
            password: addEmployeePasswordInput.value,
            type: "create"
        },
        success:function(resp){
            console.log(resp);
            $("#addEmployeeSuccess").show().delay(3000).fadeOut();
        }
    })
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
            $("#removeEmployeeSuccess").show().delay(3000).fadeOut();
        }
    })
});

//**************************EDIT EMPLOYEE******************************//

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

                editEmployeeNameInput.value = employee.name;
                editEmployeeIdInput.value = employee.emp_id;
                editEmployeePasswordInput.value = employee.password;
            }
        }
    })
})

editEmployeeSave.addEventListener("click", function(){
    $.ajax({
        url:"/edit-employee",
        type:"post",
        data:{
            old_employee_name: editEmployeeList.value,
            new_employee_name: editEmployeeNameInput.value,
            employee_id: editEmployeeIdInput.value,
            password: editEmployeePasswordInput.value,
            type: "edit"
        },
        success:function(resp){
            console.log(resp);
            $("#editEmployeeSuccess").show().delay(3000).fadeOut();
        }
    })
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

