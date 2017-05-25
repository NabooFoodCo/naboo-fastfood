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

var dbURL = process.env.DATABASE_URL || "postgres://postgres:PASSWORD@localhost:5432/naboo";

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

var storeIsOpen = false;


/**********************************TOTAL ORDERS************************************/

var itemsSold ={};
var dayTotal = 0;


/*********************************CURRENT ORDERS************************************/
var maxOrders = 10;
var orders = {};
var orderNum = 1;
var maxItemOrder = 10;
var maxIndividualItemOrder = 6;
/*********************************DETECK NEW ORDER**********************************/
var orderBefore=0;
var orderAfter=0;

/**********************************ROOT FOLDERS*************************************/
app.get("/", function(req, resp){
    resp.sendFile(CLF+"/login-page.html");
});
app.get("/kitchen-page", function(req, resp){
    if(req.session.type == "c"){
        resp.sendFile(CLF+"/kitchen-page.html");
    } else if(req.session.type == "a") {
        resp.sendFile(CLF+"/admin-page.html");
    } else {
        resp.sendFile(CLF+"/login-page.html");
    }
});
app.get("/admin-page", function(req, resp){
    if(req.session.type == "a"){
        resp.sendFile(CLF+"/admin-page.html");
    } else if(req.session.type == "c"){
        resp.sendFile(CLF+"/kitchen-page.html");
    } else {
        resp.sendFile(CLF+"/login-page.html");
    }
});
app.get("/main-page", function(req, resp){
    resp.sendFile(CLF+"/main.html");
});
app.get("/order-page", function(req, resp){
    if(storeIsOpen){
    resp.sendFile(CLF+"/order-page.html");
    }
    else {
        resp.sendFile(CLF+"/main.html");
    }
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
    fakeOrder = false;
    orderQuant = 0;
    Object.keys(req.body.order).forEach(function(key){
        orderQuant += parseInt(req.body.order[key]);
        if(req.body.order[key] > maxIndividualItemOrder || req.body.order[key] < 0){
            fakeOrder = true;
        }
    });
    if(orderQuant > maxItemOrder){
        fakeOrder = true;
    }
    if(fakeOrder){
        resp.send({status:"badOrder"});
    }
    else {
        if(Object.keys(orders).length < maxOrders){
            if(orderNum < maxOrders + 1){
                orders[orderNum] = req.body.order;
                orderNum += 1;
            }
            else {
                orderNum = 1;
                orders[orderNum] = req.body.order;
            }
            Object.keys(req.body.order).forEach(function(key){
                if(itemsSold[key]){
                    itemsSold[key] += parseInt(req.body.order[key]);
                }
                else {
                    itemsSold[key] = parseInt(req.body.order[key]);
                }
            })
            dayTotal += parseInt(req.body.totalCost);

            pg.connect(dbURL, function (err, client, done) {
                if (err) {
                    console.log(err);
                    resp.send({
                        status:"Fail",
                    })
                }
                client.query("INSERT INTO orders (cus_name,totalprice) VALUES ($1,$2)", [req.body.cusName, req.body.totalCost], function(err,result){
                    done();
                    if(err){
                        resp.send({
                            status:"Fail",
                        })
                    } else {
                        resp.send({
                          status:"success"
                        })
                        orderAfter=1;
                    }
                })
            })
        }
        else {
             resp.send({status:"Full"})
         }
    }
})

/**********************************KITCHEN*************************************/
var binnedItems = {};
var prepItems = {};
var displayStuff = "allunmake";
app.post("/updateUnmake", function(req, resp){

    if(req.body.status == "served"){

        orders[req.body.key1][req.body.key2]= req.body.numOfFood;


        resp.send({
            status:"success",
        })
    }
});
app.post("/checkUnmakeOrder", function(req, resp){

    var unmakes = eval(orders);
    for (orderNO in unmakes){
        var isEmptyOrder = true;
        var anOrder = eval(orders[orderNO]);
        for (itemId in anOrder){
            if(orders[orderNO][itemId] !=0){
                isEmptyOrder=false;
            }
        }
        if(isEmptyOrder != false){
            delete orders[orderNO];
        };
    }

    if(req.body.status == "check"){
        resp.send({
            status:"success",
            unmakeOrders:orders,
            prepItems:prepItems,
            binnedItems:binnedItems,
            displayStuff:displayStuff
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
            delete prepItems[keyOfServedFood[0]];
            keyOfServedFood.shift();
        }
        resp.send({
            status:"success",
        })
    }
});

app.post("/updateBin", function(req, resp){
    if(req.body.status == "throw"){
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
            status:"success"
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

app.post("/checkFoodItem", function (req, resp) {
    if (req.body.status == "checkFood"){
        pg.connect(dbURL, function(err, client, done){
            if(err){
                console.log(err);
            }
            client.query("SELECT item FROM food", [], function(err, result){
                done();
                if(err){
                    console.log(err);
                }
                var array = result.rows;

                resp.send({
                    status: "success",
                    food: array
                });
            });
        });

    }

})

app.post("/setType", function (req, resp) {
    if(req.body.status == "set"){
        displayStuff = req.body.displayStuff
    }
})

app.post("/checkBin", function(req, resp){
    if(req.body.status == "check"){
        resp.send({
            status:"success",
            binnedItems:binnedItems
        })
    }
});

app.post("/checkOrderChange", function(req, resp){
    if(req.body.status == "check"){
        resp.send({
            orderBefore:orderBefore,
            orderAfter:orderAfter
        })

        orderBefore= 0;
        orderAfter=0;
    }
});

/**********************************OPEN/CLOSE STORE*************************************/
//OPEN STORE
app.post("/open-store", function(req, resp){
    storeIsOpen = true;
    itemsSold = {};

    //send a response indicating that store is successfully opened
    resp.end("Success");
});

//CLOSE STORE
app.post("/close-store", function(req, resp){
    storeIsOpen = false;
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
            resp.end("Failed");
            return false;
        }

        Object.keys(itemsSold).forEach(function(key){
            console.log(key);
            client.query("SELECT * FROM foodsales WHERE date = 'now()' AND item = $1", [key], function(err,result){
                if(err){
                    console.log(err);
                    return false;
                }

                console.log(result.rows);
                if(result.rows.length > 0){
                    var currentTotal = parseInt(result.rows[0].qty);
                    var newTotal = currentTotal + itemsSold[key];
                    console.log("TOTAL: " + newTotal);
                    client.query("UPDATE foodsales SET qty = $1 WHERE item = $2", [newTotal, key], function(err,result){
                        if(err){
                            console.log(err);
                            return false;
                        }

                    })
                } else {
                    client.query("INSERT INTO foodsales (item, qty) VALUES($1, $2)", [key, itemsSold[key]], function(err,result){
                        if(err){
                            console.log(err);
                            return false;
                        }

                    })
                }
                })
            })
        done();
        resp.end("Success");
    })
})
/**********************************ITEMS SOLD*************************************/
app.post("/get-items-sold", function(req, resp){
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
            return false;
        }

        client.query("SELECT * FROM foodsales WHERE date = $1", [req.body.date_selected], function(err,result){
            done();
            if(err){
                return false;
            }
            resp.send({
                status: "Success",
                sales: result.rows
            });
        })
    })
})

app.post("/get-dates", function(req, resp){
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
            return false;
        }

        client.query("SELECT DISTINCT date FROM foodsales", function(err,result){
            done();
            if(err){
                return false;
            }
            resp.send({
                status: "Success",
                dates: result.rows
            });
        })
    })
})

/**********************************SALES*************************************/
app.post("/get-dates-sales", function(req, resp){
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
            return false;
        }

        client.query("SELECT DISTINCT date FROM orders", function(err,result){
            done();
            if(err){
                return false;
            }
            resp.send({
                status: "Success",
                dates: result.rows
            });
        })
    })
})

app.post("/get-sales", function(req, resp){
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
            return false;
        }

        client.query("SELECT * FROM orders WHERE date = $1", [req.body.date_selected], function(err,result){
            done();
            if(err){
                return false;
            }
            resp.send({
                status: "Success",
                sales: result.rows
            });
        })
    })
})

/**********************************SEND USER INFO*************************************/
app.post("/get-user", function(req, resp){
    resp.send({
        status: "Success",
        user: JSON.stringify(req.session.user),
        store: storeIsOpen
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
                    console.log(err)
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

            client.query("UPDATE food SET item = $1, price = $2, img = $3, type = $4 WHERE item = $5", [req.body.new_item_name, req.body.item_price, req.body.item_img, req.body.item_type, req.body.old_item_name], function(err,result){
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

            client.query("SELECT * FROM food WHERE item = $1", [req.body.item_name], function(err,result){
                done();
                if(err){
                    return false;
                }

                resp.send({
                    status: "Success",
                    food: result.rows
                });
            })
        })
    }
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
                    resp.send({status:"Failed"});
                    return false;
                }
                resp.send({status:"Success"});
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

            client.query("UPDATE users SET emp_id = $1, name = $2, type = $3, password = $4 WHERE name = $5", [req.body.employee_id, req.body.new_employee_name, req.body.emp_pos, req.body.pass, req.body.old_employee_name], function(err,result){
                done();
                if(err){
                    resp.send({status:"Failed"});
                    return false;
                }
                resp.send({status:"Success"});
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
                req.session.type = result.rows[0].type;
                req.session.user = result.rows[0];
                resp.send({status:"success", user:req.session.user});

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
