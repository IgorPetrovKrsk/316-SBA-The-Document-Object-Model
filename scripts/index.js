//declaring regular expressions
const userNameRegExp = new RegExp(`^[A-Za-z0-9]+$`); //only letters and numbers
const emailRegExp = new RegExp(`^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`); //valid email address

// grabbing needed elements
const newGameForm = document.getElementById(`newGameForm`);
const regUserName = newGameForm.querySelector("input[name='username']");
const regEmail = newGameForm.querySelector("input[name='email']");
const gameField = document.getElementsByClassName('game-field')[0];
const gameTable = document.getElementById(`game-table`);
const elError = document.getElementById(`errorDisplay`);
const elErrorList = document.getElementById('errorList');
const imageTemplate = document.getElementById(`image-template`);
const imageTemplate = document.getElementById(`image-template`);

//decraringGlobalVariables
let imgArray = []; //array of images numbers


// adding event listeners
newGameForm.addEventListener(`submit`, newGameFormSubmit);
regUserName.addEventListener('input', removeErrorClass); //removing error class when starting typoing
regEmail.addEventListener('input', removeErrorClass);
gameTable.addEventListener(`click`, clickOnImg);

function clickOnImg(ev) {
    if (ev.target.nodeName != `IMG`) {
        return;
    }
    alert(ev.target);
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
            newImgTag.classList.add(`image_${imgArray[ij]}`)
            ij++;
            td.appendChild(newImg);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    fieldFragment.appendChild(tbody); //fragment done 
    gameTable.appendChild(fieldFragment);
}

function createGameFiled(width, height) {
    gameTable.innerHTML = ``;
    let fieldFragment = document.createDocumentFragment();
    let tbody = document.createElement(`tbody`);
    for (let i = 0; i < height; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < width; j++) {
            let td = document.createElement('td');
            let newImg = imageTemplate.content.cloneNode(true);
            td.appendChild(newImg);            
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    fieldFragment.appendChild(tbody); //fragment done 
    gameTable.appendChild(fieldFragment);
}

function startGame() {
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
    createGameFiled(+gameTableWidth, +gameTableHeight);


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
        startGame();
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