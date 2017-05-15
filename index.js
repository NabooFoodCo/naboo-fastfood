/**********************************TESTING*************************************/
module.exports = {
    add: function (a, b) {
        return a + b;
    }
};

/**********************************CONSTS & VARS*************************************/
const NEWPORT = process.env.PORT || 10000;

const bodyParser = require("body-parser");
const session = require("express-session");
const express = require("express");
const path = require("path");
const pg = require("pg");

var CLF = path.resolve(__dirname, "pages");
var app = express();

const sv = require("http").createServer(app);
var io = require("socket.io")(sv);

io.on("connection", function(socket){
    socket.on("disconnect", function(){
    });
});

var dbURL = process.env.DATABASE_URL || "postgres://postgres:fireice27090362@localhost:5432/naboo";

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/pics", express.static("imgs"));

app.use("/css", express.static("css"));
app.use("/scripts", express.static("build"));


app.use(session({
    secret:"welcome to naboo",
    resave:true,
    saveUninitialized:true
}));

var storeIsOpen = true;


/**********************************TOTAL ORDERS************************************/

var itemsSold ={};

/**********************************CURRENT ORDERS************************************/

var orders = {};
var orderNum = 1;
var dayTotal = 0;

/**********************************ROOT FOLDERS*************************************/
app.get("/", function(req, resp){
    resp.sendFile(CLF+"/login-page.html");
});
app.get("/kitchen-page", function(req, resp){
    resp.sendFile(CLF+"/kitchen-page.html");
});
app.get("/admin-page", function(req, resp){
    if(req.session.user){
        resp.sendFile(CLF+"/admin-page.html");
    } else {
        resp.sendFile(CLF+"/login-page.html");
    }
});
app.get("/main-page", function(req, resp){
    resp.sendFile(CLF+"/main.html");
});
app.get("/order-page", function(req, resp){
    resp.sendFile(CLF+"/order-page.html");
});

/**********************************ORDER/MENU PAGE*************************************/
app.post("/menu/items", function(req, resp){
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
        }
        client.query("SELECT*FROM food ORDER BY id", [], function(err, result){
            done();
            if(err){
                console.log(err);
            }
            var array = result.rows;
            
            resp.send({
                status: "success",
                Array: array
            });
        });
    });
});

app.post("/menu/order", function(req,resp){
    if(orderNum < 5){
        orders[orderNum] = req.body.order;
        orderNum += 1;
    }
    else {
        orderNum = 1;
        orders[orderNum] = req.body.order;
    }
    Object.keys(red.body.order).forEach(function(key){
        itemsSold[key] += key;
    }
    dayTotal += parseInt(req.body.totalCost);
    console.log(dayTotal);
    console.log(orders);
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
            resp.send({
            status:"Fail",
        })
        }
        client.query("INSERT INTO orders (cus_name) VALUES ($1)", [req.body.cusName], function(err,result){
            done();
            if(err){
                resp.send({
                status:"Fail",
                })
            }
            resp.send({
                status:"success",
            })
        })
    })
})
/**********************************KITCHEN*************************************/
var unmakeOrders = {1:{"Burger":2,"Fish":5,"Saled":2},2:{"Bug":7,"Water":1},3:{"Burger":20,"Fish":5,"Saled":2},4:{"Bug":7,"Water":10},5:{"Burger":2,"Fish":5,"Saled":2},6:{"Bug":7,"Water":1}}
var binnedItems = {};
var prepItems = {1:"Fish"};
app.post("/updateUnmake", function(req, resp){

    if(req.body.status == "served"){
        console.log(unmakeOrders[req.body.key1][req.body.key2]);
        console.log(req.body.numOfFood);
        unmakeOrders[req.body.key1][req.body.key2]= req.body.numOfFood;
        console.log(unmakeOrders[req.body.key1][req.body.key2]);

        resp.send({
            status:"success",
        })
    }
});
app.post("/checkUnmakeOrder", function(req, resp){
    if(req.body.status == "check"){
        resp.send({
            status:"success",
            unmakeOrders:unmakeOrders
        })
    }
});
app.post("/updatePrep", function(req, resp){
    if(req.body.status == "served"){
        var keyOfServedFood =[]
        var prepItemskeys = Object.keys(prepItems);
        for(var i =0;i<prepItemskeys.length;i++){
            if(prepItems[prepItemskeys[i]] === req.body.food){
                keyOfServedFood.push(prepItemskeys[i]);
            }
        }
        keyOfServedFood.sort();
        for (var i=0; i<req.body.numToRemove;i++){
            binnedItems[keyOfServedFood[0]]=req.body.food;
            delete prepItems[keyOfServedFood[0]];
            keyOfServedFood.shift();
        }
        resp.send({
            status:"success",
            prepItems:prepItems
        })
    }
});

app.post("/checkPrep", function(req, resp){
    if(req.body.status == "check"){
        resp.send({
            status:"success",
            prepItems:prepItems
        })
    }
});

app.post("/madeFood", function(req, resp){
    if(req.body.status == "make"){
        var making = [];
        for(var i = 0; i<req.body.quantity;i++) {
            var time = Date.now() + i;
            prepItems[time] = req.body.foodName;
            making.push(time);
        }
        resp.send({
            status:"success",
            qtymade:req.body.quantity,
            making:making
        })
    }
});


/**********************************OPEN/CLOSE STORE*************************************/
//OPEN STORE
app.post("/open-store", function(req, resp){
    storeIsOpen = true;

    //send a response indicating that store is successfully opened
    resp.end("Success");
});

//CLOSE STORE
app.post("/close-store", function(req, resp){
    storeIsOpen = false;
    //TODO [Anyone] : After store is closed, reset all data from the sales table

    //send a response indicating that store is successfully closed
    resp.end("Success");
});

/**********************************SEND USER INFO*************************************/
app.post("/get-user", function(req, resp){
    resp.send({
        status: "Success",
        user: JSON.stringify(req.session.user)
    })
});

/**********************************SEND EMPLOYEE NAMES*************************************/
app.post("/get-employees", function(req, resp){
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
            return false;
        }

        client.query("SELECT name FROM users", function(err,result){
            done();
            if(err){
                return false;
            }
            resp.send({
                status: "Success",
                users: JSON.stringify(result.rows)
            });
        })
    })
})

/**********************************SEND ITEM NAMES*************************************/
app.post("/get-items", function(req, resp){
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
            return false;
        }

        client.query("SELECT item FROM food", function(err,result){
            done();
            if(err){
                return false;
            }
            resp.send({
                status: "Success",
                items: JSON.stringify(result.rows)
            });
        })
    })
})

/**********************************ADD ITEM*************************************/
app.post("/add-item", function(req, resp){
    if(req.body.type == "create"){
        pg.connect(dbURL, function (err, client, done) {
            if (err) {
                console.log(err);
                return false;
            }

            client.query("INSERT INTO food (item, price, img, type) VALUES ($1, $2, $3, $4)", [req.body.item_name, req.body.item_price, req.body.item_img, req.body.item_type], function(err,result){
                done();
                if(err){
                    return false;
                }
                resp.end("Item Added!");
            })
        })
    };
});

/**********************************REMOVE ITEM*************************************/
app.post("/remove-item", function(req, resp){
    if(req.body.type == "remove"){
        pg.connect(dbURL, function (err, client, done) {
            if (err) {
                console.log(err);
                return false;
            }

            client.query("DELETE FROM food WHERE item = $1", [req.body.item_name], function(err,result){
                done();
                if(err){
                    return false;
                }
                resp.end("Item Removed!");
            })
        })
    };
});

/**********************************EDIT ITEM*************************************/
app.post("/edit-item", function(req, resp){
    if(req.body.type == "edit"){
        pg.connect(dbURL, function (err, client, done) {
            if (err) {
                console.log(err);
                return false;
            }

            client.query("UPDATE food SET item = $1, price = $2 WHERE item = $3", [req.body.new_item_name, req.body.item_price, req.body.old_item_name], function(err,result){
                done();
                if(err){
                    return false;
                }
                resp.end("Edit Success!");
            })
        })
    };
});

/**********************************ADD EMPLOYEE*************************************/
app.post("/add-employee", function(req, resp){
    if(req.body.type == "create"){
        pg.connect(dbURL, function (err, client, done) {
            if (err) {
                console.log(err);
                return false;
            }

            client.query("INSERT INTO users (emp_id, type, name, password) VALUES ($1, $2, $3, $4)", [req.body.employee_id, req.body.position, req.body.name, req.body.password], function(err,result){
                done();
                if(err){
                    return false;
                }
                resp.end("Employee Added!");
            })
        })
    };
});

/**********************************REMOVE EMPLOYEE*************************************/
app.post("/remove-employee", function(req, resp){
    if(req.body.type == "remove"){
        pg.connect(dbURL, function (err, client, done) {
            if (err) {
                console.log(err);
                return false;
            }

            client.query("DELETE FROM users WHERE name = $1", [req.body.name], function(err,result){
                done();
                if(err){
                    return false;
                }
                resp.end("Employee Removed!");
            })
        })
    };
});

/**********************************EDIT EMPLOYEE*************************************/
app.post("/edit-employee", function(req, resp){
    if(req.body.type == "edit"){
        pg.connect(dbURL, function (err, client, done) {
            if (err) {
                console.log(err);
                return false;
            }

            client.query("UPDATE users SET emp_id = $1, name = $2, password = $3 WHERE name = $4", [req.body.employee_id, req.body.new_employee_name, req.body.password, req.body.old_employee_name], function(err,result){
                done();
                if(err){
                    return false;
                }
                resp.end("Edit Success!");
            })
        })
    };

    if(req.body.type == "select"){
        pg.connect(dbURL, function (err, client, done) {
            if (err) {
                console.log(err);
                return false;
            }

            client.query("SELECT * FROM users WHERE name = $1", [req.body.employee_name], function(err,result){
                done();
                if(err){
                    return false;
                }

                resp.send({
                    status: "Success",
                    user: result.rows
                });
            })
        })
    }
});

/**********************************LOGIN*************************************/
app.post("/accountLOGIN", function(req, resp){
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }
        
        client.query("SELECT id, emp_id, type, name, password FROM users WHERE emp_id = $1 AND password = $2", [req.body.d_empId, req.body.d_password], function(err, result){
            
            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }
            
            if(result.rows.length > 0){
                req.session.user = result.rows[0];
                if(result.rows[0].type=="a"){
                    resp.send({status:"success", user:req.session.user});
                }
                if(result.rows[0].type=="c"){
                    resp.send({status:"success2", user:req.session.user});
                }
            } else {
                resp.send({status:"fail"});
            }
        });
    })
});

/**********************************LOGOUT*************************************/
app.post("/logout", function(req, resp){
    req.session.destroy();
    resp.end("success");
});

/**********************************LISTEN*************************************/
sv.listen(NEWPORT, function(err){
    if(err){
        console.log(err);
        return false;
    }
    console.log(NEWPORT+" is running");
});




