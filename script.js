import { DefusalPuzzle } from "./DefusalPuzzle.js"

const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry) =>{
        if (entry.isIntersecting){
            entry.target.classList.add("show")
        } else{
            entry.target.classList.remove("show")
        }
    })
})

const hiddenElements = document.querySelectorAll(".hidden")
hiddenElements.forEach((el)=> observer.observe(el))

const defusalPuzzle = new DefusalPuzzle();

let timerCountdown = setInterval(function(){
    defusalPuzzle.setTimer(defusalPuzzle.currentTime);
    defusalPuzzle.currentTime -= 1;
    if (defusalPuzzle.currentTime === -1) clearInterval(timerCountdown)
},1000)