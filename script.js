/* En base a la api Open Trivia (https://opentdb.com/api_config.php), vamos a desarrollar un trivial con la siguiente 
url 'https://opentdb.com/api.php?amount=10'. Esta api nos devolverá una serie de preguntas con sus respuestas, 
tanto erroneas como correctas. 

La idea es hacer un juego en el que el usuario introduzca en un input las caracteristicas del Trivial y que al darle 
al 'Start Game' le salgan las preguntas de la api para que pueda comenzar el juego. Una vez las responda todas, 
le mostraremos al usuario el resultado.

Ten en cuenta que hay dos tipos de preguntas. Aquellas con 3 respuestas erroneas y 1 correcta y aquellas con 
respuesta verdadero / falso.
 */

const input$$ = document.querySelector(".numberOfQuestions");
const startButton$$ = document.querySelector(".startGame");
const divGame$$ = document.querySelector('[data-function="gameboard"]');
const checkButton$$ = document.querySelector(".checkGame");
const conclusion$$ = document.querySelector(".conclusion");




let correctAnswers = [];
let incorrectAnswers = [];
let allAnswers = [];
let selectedAnswers = [];
let countCorrect = 0;


const loadQuestions = async () => {
    let url = "https://opentdb.com/api.php?amount=";
    const category$$ = document.querySelector("#category");
    let categoria = category$$.value;

    

    const rbs = document.querySelectorAll('input[name="choice"]');
    let selectedDifficulty;
        for (const rb of rbs) {
            if (rb.checked) {
                selectedDifficulty = rb.value;
                break;
            }
        }
    /* alert(selectedDifficulty); */

    url = url + input$$.value;

    if (categoria != "any") {
        url = url + "&category=" + categoria;
    };


    if (selectedDifficulty != "Any difficulty" && selectedDifficulty != undefined) {
        url = url + "&difficulty=" + selectedDifficulty;
    };
    /* alert(url); */
    const questionData = await fetch(url);
    const questionDataRes = await questionData.json();

   /*  console.log(questionDataRes); */
    
    divGame$$.innerHTML = '';
    conclusion$$.innerHTML = '';
    

    correctAnswers = questionDataRes.results.map(question => (question.correct_answer));
    incorrectAnswers = questionDataRes.results.map(question => (question.incorrect_answers));
    questionTest = questionDataRes.results.map(question => (question.question));
    questionCategory = questionDataRes.results.map(question => (question.category));

    for (let i = 0; i < input$$.value; i++) {
        const printQuestion$$ = document.createElement('h3');
        divGame$$.appendChild(printQuestion$$);

        let correctedQuestion = questionTest[i].replace(/&quot;/g, "'");
        correctedQuestion = correctedQuestion.replace(/&#039;/g, "'");
        correctedQuestion = correctedQuestion.replace(/&eacute;/g, "é");
        printQuestion$$.innerText = `${i+1}: Category: ${questionCategory[i]} ==> ${correctedQuestion}`;
        allAnswers[i] = [correctAnswers[i], ...incorrectAnswers[i]];
        let randomAnswers = shuffle(allAnswers[i]);

        const printAnswers$$ = document.createElement('form');
        const selectAnswers$$ = document.createElement('select');
        printAnswers$$.appendChild(selectAnswers$$);
        divGame$$.appendChild(printAnswers$$);
        for(let j = 0; j < randomAnswers.length; j++){
            selectAnswers$$.innerHTML += `<option value="${[j]}">${randomAnswers[j]}</option>`
        };

        checkButton$$.addEventListener('click', () => {
            if (i == 0){
                conclusion$$.innerText = '';
                countCorrect = 0;
            };  
            selectedAnswers = [];
            const selectedValues = [].filter
                .call(selectAnswers$$.options, option => option.selected)
                .map(option => option.text);
            selectedAnswers.push(selectedValues[0]);

            const solucionh4$$ = document.createElement('h4');
            conclusion$$.appendChild(solucionh4$$);

            if (correctAnswers[i] == selectedAnswers[0]){
              countCorrect++;
              solucionh4$$.innerText += `la respuesta de la pregunta ${[i+1]} es correcta`;
               
            } else {
                solucionh4$$.innerText += `la respuesta de la pregunta ${[i+1]} es erronea`;
            };

            if (i == input$$.value-1) {
                const conclusionMessage$$ = document.createElement('div');
                conclusion$$.appendChild(conclusionMessage$$);
                conclusionMessage$$.innerHTML = `<h3 class="mensaje">Has acertado ${countCorrect} de ${input$$.value} preguntas </h3>`;
            };  
                 
        });
        
    };
   

      
 };
    

startButton$$.addEventListener('click', loadQuestions);


function shuffle(arr) {
    let newArr = arr;
    
    let k = Math.floor(Math.random() * (newArr.length));
    [newArr[0], newArr[k]] = [newArr[k], newArr[0]];
    
    return newArr;
};



