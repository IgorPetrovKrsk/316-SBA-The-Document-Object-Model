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


// adding event listeners
newGameForm.addEventListener(`submit`, newGameFormSubmit);
regUserName.addEventListener('input', removeErrorClass); //removing error class when starting typoing
regEmail.addEventListener('input', removeErrorClass);

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

//The email must be a valid email address.
//The email must not be from the domain "example.com."
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

function startGame(){
    elErrorList.style.visibility = `hidden`;
    gameField.style.visibility = `visible`;
    //find what tipy of field was selected

    
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