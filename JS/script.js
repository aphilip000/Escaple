
$(document).ready(function () {
    let flag = true;

    $('#slide').css('opacity','0.0');
    $('#slide').fadeTo(5000,1);

    function changeColor(){
        if(flag){
            $('#slide').css("color", "black");
            flag = false;
        }
        else {
            $('#slide').css("color", "rgb(177, 51, 51)");
            flag = true;
        }
    }
    
    $(function() {
        changeColor();
        setInterval(changeColor, 2000);
        // setInterval(rotateCover, 5);
    })
})
