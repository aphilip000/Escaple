let words = new Array("Work", "In", "Progress");

let num = 0;

document.getElementById('words' + num).innerHTML = words[num];
WIPAnimation();

function WIPAnimation()
{
    counter();

    document.getElementById('words' + num).innerHTML = words[num];

    if(num == 0)
    {
        document.getElementById('words0').style.opacity = 1;
        document.getElementById('words1').style.opacity = 0;
        document.getElementById('words2').style.opacity = 0;
    }
    else if(num == 1)
    {
        document.getElementById('words0').style.opacity = 0;
        document.getElementById('words1').style.opacity = 1;
        document.getElementById('words2').style.opacity = 0;
    }
    else if(num == 2)
    {
        document.getElementById('words0').style.opacity = 0;
        document.getElementById('words1').style.opacity = 0;
        document.getElementById('words2').style.opacity = 1;
    }
    setTimeout(WIPAnimation, 500);
}

function counter()
{
    if(num < words.length - 1)
    {
        num++;
    }
    else
    {
        num = 0;
    }
}
