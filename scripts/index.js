//declaring regular expressions
const userNameRegExp = new RegExp(`^[A-Za-z0-9]+$`); //only letters and numbers
const emailRegExp = new RegExp(`^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`); //valid email address

// grabbing needed elements
const newGameForm = document.getElementById(`newGameForm`);
const regUserName = newGameForm.querySelector("input[name='username']");
const regEmail = newGameForm.querySelector("input[name='email']");
const gameField = document.getElementsByClassName('game-field')[0];
const gameTable = document.getElementById(`game-table`);
const gameSuggestion = document.getElementById(`gameSuggestions`);
const elError = document.getElementById(`errorDisplay`);
const elErrorList = document.getElementById('errorList');
const imageTemplate = document.getElementById(`image-template`);


//decraringGlobalVariables
let imgArray = []; //array of images numbers
let seconds=5;
let timerIDBeforeStart; //to stop timer
let timerIDAfterStart; //to stop timer and store current seconds
let selectedImg = null;
let selectedImg2= null;


// adding event listeners
newGameForm.addEventListener(`submit`, newGameFormSubmit);
regUserName.addEventListener('input', removeErrorClass); //removing error class when starting typoing
regEmail.addEventListener('input', removeErrorClass);

//function checkIfGameIsWin

function closeImgAndRestoreEventListener() {
    selectedImg.classList.remove(`img_open`);        
    selectedImg2.classList.remove(`img_open`);     
    selectedImg.classList.add(`img_closed`);           
    selectedImg2.classList.add(`img_closed`);           
    selectedImg.src = `../images/image_back.png`;
    selectedImg2.src = `../images/image_back.png`;
    selectedImg=null;
    selectedImg2=null;
    gameTable.addEventListener(`click`, clickOnImg); //reading the listener
}

function clickOnImg(ev) {
    if (ev.target.nodeName != `IMG`) {
        return;
    }
    if (ev.target.classList.contains(`img_closed`)){
        ev.target.classList.remove(`img_closed`);        
        ev.target.src = `../images/${ev.target.name}.png`;
        if (!selectedImg){
            selectedImg = ev.target; //store this one
        } else { 
            if (selectedImg.name == ev.target.name){
                ev.target.classList.add(`img_open`);
                selectedImg.classList.add(`img_open`);
                selectedImg=null;
                selectedImg2=null;
                //checkIfGameIsWin();
            } else { //close both images
                selectedImg2 = ev.target;
                gameTable.removeEventListener(`click`, clickOnImg); //remove the listener and get it back after a while
                setTimeout(closeImgAndRestoreEventListener,1000);
            }
        }
    }
}

function createGameArray(numOfRandomPictures) {
    imgArray = []; //clear the array
    for (let i = 0; i < numOfRandomPictures*2; i+=2) {
        let randomPicture = Math.floor(Math.random() * 15) + 1; //random from 1 to 15
        while (imgArray.find(it => it == randomPicture)) {
            randomPicture = Math.floor(Math.random() * 15) + 1;
        }
        imgArray[i] = randomPicture;
        imgArray[i + 1] = randomPicture;
    }
    imgArray.sort(() => Math.random() - 0.5); //randomizing pictures array
    // console.log(imgArray);
}
function updateGameTimer(){
    seconds++;
    gameSuggestion.textContent = `Current game lasts for ${seconds} seconds`;
}

function updateStartTimer() {
    seconds--;
    gameSuggestion.textContent = `Game starts in ${seconds}`
    
}

function startGame() {
    clearInterval(timerIDBeforeStart);
    timerIDAfterStart = setInterval(updateGameTimer,1000);
    gameSuggestion.textContent = `Current game lasts for 0 seconds`;
    const allImg = gameField.querySelectorAll("img");
    allImg.forEach (it => {
        it.src = `../images/image_back.png`;
        it.classList.remove(`img_open`);
        it.classList.add(`img_closed`);
    });
    gameTable.addEventListener(`click`, clickOnImg); //lets look for clicks only after game starts
}

function createGameFiled(width, height) {
    gameTable.innerHTML = ``;
    let fieldFragment = document.createDocumentFragment();
    let tbody = document.createElement(`tbody`);
    let ij=0; //pointer for img array
    for (let i = 0; i < height; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < width; j++) {
            let td = document.createElement('td');
            let newImg = imageTemplate.content.cloneNode(true);
            let templateDiv = newImg.firstElementChild;
            let newImgTag = templateDiv.firstElementChild;
            newImgTag.src = `../images/image_${imgArray[ij]}.png`;
            newImgTag.name = `image_${imgArray[ij]}`;
            ij++;
            td.appendChild(newImg);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    fieldFragment.appendChild(tbody); //fragment done 
    gameTable.appendChild(fieldFragment);
}

function prepareGame() {
    let gameTableWidth = 0;
    let gameTableHeight = 0;
    elErrorList.style.visibility = `hidden`;
    gameField.style.visibility = `visible`;
    //find what tipy of field was selected
    const regGameType = newGameForm.querySelectorAll("input[name='game-type']");
    regGameType.forEach(it => {
        if (it.checked == true) { //this calls for try catch
            gameTableWidth = parseInt(it.id.split(`-`)[2]);
            gameTableHeight = parseInt(it.id.split(`-`)[3]);
        }
    });
    createGameArray(gameTableWidth*gameTableHeight/2)
    createGameFiled(+gameTableWidth, +gameTableHeight);
    seconds = 1;
    gameSuggestion.textContent = `Game starts in ${seconds}`
    timerIDBeforeStart = setInterval(updateStartTimer,1000);
    setTimeout(startGame,seconds*1000)

}

function newGameFormSubmit(ev) {
    let errors = [];
    ev.preventDefault();
    newGameForm.querySelectorAll('input').forEach(it => { //grabbing all the input elements from form and removing error class
        it.classList.remove('error');
    })
    elErrorList.innerHTML = ``; //clearing the error list

    errors = errors.concat(validateUserName());
    errors = errors.concat(validateEmail());

    if (errors.length) {
        elErrorList.innerHTML = `<h4>There are errors:<\h4>`; //hardcoding is BAD :-)
        ev.preventDefault();
        errors.forEach(it => {
            const elErrorLi = document.createElement(`li`);
            elErrorLi.textContent = it.errorMessage;
            elErrorList.appendChild(elErrorLi);
            it.element.classList.add('error');
            it.element.focus(); //focus on the last error
        })
        elError.style.display = `block`;
    } else { //no errors starting the game
        prepareGame();
    }
}











function removeErrorClass(ev) {
    ev.target.classList.remove(`error`);
}

function validateUserName() {
    let errors = [];
    if (!userNameRegExp.test(regUserName.value)) {
        errors.push({ element: regUserName, errorMessage: `The username cannot contain any special characters or whitespaces.` });
    }
    let containsUniqes = false;
    for (let i = 1; i < regUserName.value.length; i++) {
        if (regUserName.value[0] != regUserName.value[i]) {
            containsUniqes = true;
            break;
        }
    }
    if (!containsUniqes) {
        errors.push({ element: regUserName, errorMessage: `The username must contain at least two unique characters.` });
    }
    return errors;
}

function validateEmail() {
    let errors = [];
    if (regEmail.value.toLowerCase().includes(`example.com`)) {
        errors.push({ element: regEmail, errorMessage: `The email must not be from the domain "example.com."` });
    }
    if (!emailRegExp.test(regEmail.value)) {
        errors.push({ element: regEmail, errorMessage: `The email must be a valid email address.` });
    }
    return errors;
}