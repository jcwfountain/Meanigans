//keypad
const correctFrequency = Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString()
const correctFrequencyType = (Math.random() > 0.5) ? "AM" : "FM";
const alphabet = "ABCDEFGHJKLMNPQRSTUV"
const countries = ["US","GB","DE","AM","CN","IN","PK","MX","RU","JP"]

//find code paragraphs
let codeParagraphs = Array.from(document.querySelectorAll("p"));
let codeList = [];
codeParagraphs = codeParagraphs.filter((element) => {return element.innerText.includes("CODE")})

var numpadCodeKey = new Map();
for (let i = 0; i< countries.length;i++){
    let newCode1 = Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString()
    let newCode2 = Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString()
    let newCode3 = Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString()
    codeList.push(newCode1);
    codeList.push(newCode2);
    codeList.push(newCode3);
    numpadCodeKey.set(countries[i],[newCode1,newCode2,newCode3])
}
//assign random codes to p
codeParagraphs.forEach((element)=>{
    let id = element.innerText.replace(/[^0-9]/g, '');
    element.innerText = codeList[id-1]
})
console.log(numpadCodeKey)

const NumpadDisplay = document.getElementById("keypadDisplay")
const NumpadEnter = document.getElementById("numpadEnter")
const WiresArray = document.querySelectorAll(".wire")
const colors = ["Blue","Green","Red","Yellow"]
const batteryOptions = ["D","AA"];
const DefusalTimer = document.getElementById("defusalTimer")
const Battery = document.getElementById("batteries")

//dials
const DialTen = document.getElementById("dialTen")
const DialOne = document.getElementById("dialOne")
const DialDecimal = document.getElementById("dialDecimal")
const FrequencyDisplay = document.getElementById("frequencyDisplay")

const PuzzleID = document.getElementById("puzzleID")

//manual
const PageLeft = document.getElementById("manualLeftButton")
const PageRight = document.getElementById("manualRightButton")
const PagesArray = document.querySelectorAll(".pageChild")

export class DefusalPuzzle{
    constructor(){
        console.log(correctFrequencyType + correctFrequency)
        this.currentTime = 5 * 60;
        this.frequencyType = "FM"
        this.frequencyTen = 0;
        this.frequencyOne = 0;
        this.frequencyDecimal = 0;
        this.country = countries[Math.floor(Math.random()*countries.length)]
        this.leftPage = 0;
        //add numpad inputs
        for (let i = 0; i <= 9; i++){
            const element = document.getElementById("numpad" + i);
            element.addEventListener("click",()=>{
                if (NumpadDisplay.innerText.length < 4) NumpadDisplay.innerText += i;
            })
        }
        //add wire colors
        WiresArray.forEach((element)=>{
            let color = colors[Math.floor(Math.random()*colors.length)]
            element.style.backgroundImage = "url('wires/" + color + ".png')"
            element.addEventListener("click",()=>{
                element.style.backgroundImage = "url('wires/" + color + "cut.png')"
            })
        })
        //enter button on keypad
        this.numpadSolved = false;

        NumpadEnter.addEventListener("click",()=>{
            if (NumpadDisplay.innerText === this.correctNumpadCode){
                console.log("CODE CORRECT")
                NumpadDisplay.style.backgroundColor = "green";
                NumpadDisplay.innerText = "GOOD";
                this.numpadSolved = true;
            }
            else if (this.numpadSolved === false){
                NumpadDisplay.classList.add("flashRed")
                this.currentTime -= 10;
                setTimeout(()=>{
                    NumpadDisplay.classList.remove("flashRed")
                    NumpadDisplay.innerText = ""
                },900)
            }
        })
        //randomize battery
        this.batteryType = batteryOptions[Math.floor(Math.random()*batteryOptions.length)];
        Battery.style.backgroundImage = "url('wires/" + this.batteryType + " Batteries.png')"
        //configure dials
        this.setUpDial(DialTen,"ten")
        this.setUpDial(DialOne,"one")
        this.setUpDial(DialDecimal,"decimal")
        FrequencyDisplay.innerText = "FM: 00.0"
        //set up id;
        this.IDLetters = alphabet.charAt(Math.floor(Math.random()*alphabet.length)) + alphabet.charAt(Math.floor(Math.random()*alphabet.length))
        this.IDNumbers = Math.floor(Math.random()*10000000)
        PuzzleID.innerText = "#" + this.country + this.IDLetters + this.IDNumbers;
        //correct numpad code

        let i = 0;
        this.IDNumbers.toString().split("").forEach((element)=>{i+=parseInt(element)})
        this.securityCode = i;
        let securityCodeIdentifier;
        if (this.securityCode >= 44) securityCodeIdentifier = 2;
        else if (this.securityCode >= 22) securityCodeIdentifier = 1;
        else securityCodeIdentifier = 0;


        console.log(`Security Code: ${this.securityCode}`)
        this.correctNumpadCode = numpadCodeKey.get(this.country)[securityCodeIdentifier];
        console.log(`Numpad Code: ${this.correctNumpadCode}`)

        //manual logic,
        this.updateManual()
        PageLeft.addEventListener("click",()=>{
            if (this.leftPage != 0) this.leftPage -= 1
            this.updateManual()
        })
        PageRight.addEventListener("click",()=>{
            this.leftPage += 1
            this.updateManual()
        })
    }
    //timer logic, handles frequency solved
    setTimer(timeLeft){
        let hour = Math.floor(timeLeft / 60);
        let minutes = timeLeft % 60;
        if (minutes < 10) minutes = "0" + minutes;
        if (timeLeft < 30) DefusalTimer.classList.add("flashingText")
        if (timeLeft < 10) DefusalTimer.style.animationDuration = "0.5s"
        if (timeLeft <= 3) DefusalTimer.style.animationDuration = "0.2s"
        //check for solved frequency
        if (timeLeft % 60 === 0){
            const currentFreq = this.frequencyTen.toString() + this.frequencyOne.toString() + this.frequencyDecimal.toString()
            FrequencyDisplay.style.color = "yellow";
            console.log("changed to yellow")
            const returnColor = setTimeout(()=>{FrequencyDisplay.style.color = "red"},1000)
            if (currentFreq === correctFrequency) console.log("FREQUENCY CORRECT")
        }

        DefusalTimer.innerText = hour + ":" + minutes;
    }
    setUpDial(Dial,variable){
        Dial.addEventListener("mousedown",()=>{
            const eventHandle = (event)=>{
                //calcualte angle
                const result = Math.floor(calculateAngle(event,Dial) - 90)
                Dial.style.transform = `rotate(${result}deg)`

                const transformedDeg = (result > 0) ? result : (result + 360);
                if (variable === "ten") this.frequencyTen = Math.floor(transformedDeg/36);
                else if (variable === "one") this.frequencyOne = Math.floor(transformedDeg/36);
                else this.frequencyDecimal = Math.floor(transformedDeg/36);
                FrequencyDisplay.innerText = "FM: " + this.frequencyTen + "" + this.frequencyOne + "." + this.frequencyDecimal
            }
            Dial.addEventListener("mousemove",eventHandle)
            Dial.addEventListener("mouseup",()=>{
                Dial.removeEventListener("mousemove",eventHandle)
            })
        })
    }
    updateManual(){
        PagesArray.forEach((element)=>{
            element.style.display = "none"
        })
        PagesArray[this.leftPage].style.display = "block"
        PagesArray[this.leftPage + (PagesArray.length / 2)].style.display = "block"
    }
}
function calculateAngle(e,div){
    const rect = div.getBoundingClientRect();
    const x1 = rect.left + rect.width / 2;
    const y1 = rect.top + rect.height / 2;
    const x2 = e.clientX
    const y2 = e.clientY

    const deltaX = x1 - x2
    const deltaY = y1 - y2

    const radian = Math.atan2(deltaY,deltaX);
    let deg = radian * (180 / Math.PI)
    return deg;
}