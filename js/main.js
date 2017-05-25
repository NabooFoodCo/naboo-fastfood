$(document).ready(function(){
    var img1 = new Image();
    img1.src = "/pics/Gungan Special Massive Fly Poutine.png";
    var img2 = new Image();
    img2.src = "/pics/Falumpaset Meat Skewer.png";
    var img3 = new Image();
    img3.src = "/pics/Aquatic plant Salad.png";
    var curImg = 1;
    var timeOutS;
    var running = 0;
    function timeOut(){
        running = 1;
        timeOutS = setTimeout(function(){
            changeImg();
        }, 2500);
    }
    function changeImg(){
        document.images.slide.src=eval("img"+curImg+".src");
        if(curImg<3){
            curImg ++;
        }
        else {
            curImg = 1;
        }
        timeOut();
    }
    
    function staticChangeImg(){
        document.images.slide.src=eval("img"+curImg+".src");
        if(curImg<3){
            curImg ++;
        }
        else {
            curImg = 1;
        }
    }
    
    var pause = document.getElementById("pause"),
        play = document.getElementById("play");
    
    var items = [pause, play];
    
    //This Function makes the option "glow/highlighted" when it's selected
    var active;
    function glow(active){
        for(var i=0;items.length>i;i++){
            if(items[i]==active){
                items[i].style.background = "rgba(0,0,0,.6)";
                items[i].style.border = "1px inset white";
            } else {
                items[i].style.background = "none";
                items[i].style.border = "none";
            }
        }
    }
    
    document.getElementById("orderButton").addEventListener("click",function(){
        location.href ="/order-page";
    })
    document.getElementById("next").addEventListener("click",function(){
        if (running==1){
        clearTimeout(timeOutS);
        changeImg();
        }
        else{
            staticChangeImg();
        }
    })
    document.getElementById("previous").addEventListener("click",function(){
        if (running==1){
            clearTimeout(timeOutS);
            if(curImg==1){
                curImg = 2;
            }
            else if(curImg==2){
                curImg = 3;
            }
            else {
                curImg -= 2;
            }
            changeImg();
        }
        else {
            if(curImg==1){
                curImg = 2;
            }
            else if(curImg==2){
                curImg = 3;
            }
            else {
                curImg -= 2;
            }
            staticChangeImg();
        }
    })
    document.getElementById("pause").addEventListener("click",function(){
        active = pause;
        glow(active);
        
        clearTimeout(timeOutS);
        running = 0;
    })
    document.getElementById("play").addEventListener("click",function(){
        active = play;
        glow(active);
        
        if (running == 0){
        timeOut();
        }
    })
    changeImg();
    
})
