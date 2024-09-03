const NumButtons = document.querySelectorAll('.number');
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const clear = document.getElementById('Ac');
const percent = document.getElementById('percent');
const plusAndMinus = document.getElementById('plusAndMinus');
const equal = document.getElementById('equal');
const signs = document.querySelectorAll('.sign');

let CalArray = [];
let click = false;
input2.value = 0;
let result = 0

// Add number button click event listeners
NumButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        let value = e.target.value;

        if((input2.value).includes('.') && value == "."){
          value =""
        }
        
        if((!click && input1.value == "") || result != 0){
            result = 0
            CalArray = [];
            input2.value = "";
            input1.value = "";
            click = true; 
        }
        if(input2.value =="" && value == "."){
            input2.value = "0"; 
            input1.value += "0"; 
       }

        input1.value += value;
        input2.value += value; 
    });
});

// Add sign button click event listeners
signs.forEach(button => {
    button.addEventListener("click", (e) => {
        const checkWithSign = /[-+x/]$/
        
        if(checkWithSign.test(input1.value) || input1.value == ""){
            return ;
        }else{
            const value = e.target.value;
            if(result != 0){
                CalArray = [input2.value,value];
                input1.value = input2.value;
                input2.value = "";
            }
            input1.value += value;
            result == 0 && CalArray.push(input2.value, value);
            input2.value = "";
            result = 0
        }
        
    });
});

// Add equal button click event listener
equal.addEventListener("click", () => {
    const checkEqual = /\d$/
    if(checkEqual.test(input1.value)){
        CalArray.push(input2.value);
        result = Calculate(CalArray);
        input1.value += "=" + result;
        input2.value = result;
    }else{
        return ; 
    }
    
});

// Add clear button click event listener
clear.addEventListener('click', () => {
    CalArray = [];
    click = false;
    input2.value = 0;
    input1.value = "";
    result = 0
});

// Add percent button click event listener
percent.addEventListener('click', () => {
    //if input2 is not empty and is a valid number
    if (input2.value !== "" && !isNaN(input2.value)) {      
        const percentageValue = parseFloat(input2.value) / 100;
        input2.value = percentageValue;

        // Update input1 to reflect the percentage operation and capture last whole or decimal number 
        input1.value = input1.value.replace(/(\d+)(\.\d+)?$/, percentageValue);
    }
});

plusAndMinus.addEventListener('click', () => {
   
    if(input2.value !== "" && !isNaN(input2.value)){
        const plusMinus = parseFloat(input2.value) *-1
        input2.value = plusMinus
        if(CalArray[1] == undefined){
            input1.value = input1.value.replace(/-?(\d+)(\.\d+)?$/, plusMinus);
        }else{
            input1.value = input1.value.replace(/(?<=\d+[+-x/])-?(\d+)(\.\d+)?$/, plusMinus);
        }
        
    }
})

// Function to perform the calculation
const Calculate = (arr) => {
    const precise = (value) => Number(Math.round(value + 'e+12') + 'e-12');

    // Process multiplication and division first
    let newArr = arr.reduce((acc, curr, index) => {
        if (curr === "x") {
            acc[acc.length - 1] = precise(acc[acc.length - 1] * Number(arr[index + 1]));
        } else if (curr === "/") {
            acc[acc.length - 1] = precise(acc[acc.length - 1] / Number(arr[index + 1]));
        } else if (index === 0 || (arr[index - 1] !== "x" && arr[index - 1] !== "/")) {
            acc.push(curr === "+" || curr === "-" ? curr : Number(curr));
        }
        return acc;
    }, []);

    // Then handle addition and subtraction
    return newArr.reduce((result, curr, index) => {
        if (curr === "+") {
            return precise(result + newArr[index + 1]);
        } else if (curr === "-") {
            return precise(result - newArr[index + 1]);
        }
        return result;
    });
};
