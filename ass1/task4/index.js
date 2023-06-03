function validFirstName() {
    let firstName = input.firstname.value;
    let nameRegex = /^[a-zA-Z]+/; 
    let nameLength = firstName.length
    if (firstName == " " || !(nameRegex.test(firstName)) || nameLength < 3 || nameLength > 50) {
        document.getElementById("output").innerHTML="Do not enter an invalid firstname";
        return true;
    } else {
        document.getElementById("output").innerHTML="";
    }

}

function validLastName() {
    let lastName = input.lastname.value;
    let nameRegex = /^[a-zA-Z]+/; 
    let nameLength = lastName.length
    if (lastName == "" || !(nameRegex.test(lastName)) || nameLength < 3 || nameLength > 50) {
        document.getElementById("output").innerHTML="Do not enter an invalid lastname";
    } else {
        document.getElementById("output").innerHTML="";
    }
}

function validBirthDate() {
    let birthDate = input.birthdate.value;
    let dateRegex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if (!dateRegex.test(birthDate)) {
        document.getElementById("output").innerHTML="Do not enter an invalid date of birth";
    } else {
        document.getElementById("output").innerHTML=createOutput();
    }
    
}

function printOutput() {
    
    document.getElementById("output").innerHTML=createOutput();

}

function createOutput() {
    let fullName = input.firstname.value + " " + input.lastname.value
    let birthDate = input.birthdate.value
    let birthYear = birthDate.match(/[0-9]{4}$/);
    let age = new Date().getFullYear() - birthYear
    let cheese = input.Cheese.value


    // I used some code from https://stackoverflow.com/questions/8563240/how-to-get-all-checked-checkboxes
    // this is used to check what cities have been selected
    let checkboxes = input.city;
    let checkboxesChecked = []
    for (let i=0; i<checkboxes.length; i++) {
        if (checkboxes[i].checked) {
           checkboxesChecked.push(checkboxes[i].value);
        }
    }
    if (checkboxesChecked.length > 0) {
        let cities = checkboxesChecked
        return "Hello " + fullName + ", you are " + age + " years old, your favourite cheese is " + cheese + " and you've lived in "+ cities +"."
    } else {
        return "Hello " + fullName + ", you are " + age + " years old, your favourite cheese is " + cheese + " and you've lived in no cities."
    }

}

function clearForm() {
    document.getElementById("output").innerHTML="";

}
