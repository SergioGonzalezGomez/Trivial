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
//SELECTOR DE DIFICULTAD
    const rbs = document.querySelectorAll('input[name="choice"]');
    let selectedDifficulty;
        for (const rb of rbs) {
            if (rb.checked) {
                selectedDifficulty = rb.value;
                break;
            }
        }
    
    url = url + input$$.value;
    if (categoria != "any") {
        url = url + "&category=" + categoria;
    };

    if (selectedDifficulty != "Any difficulty" && selectedDifficulty != undefined) {
        url = url + "&difficulty=" + selectedDifficulty;
    };
 //LECTURA DE DATOS CON EL ENDPOINT URL MODIFICADO   
    const questionData = await fetch(url);
    const questionDataRes = await questionData.json();
 //VACIADO DE VARIABLES PARA QUE NO SE AMONTONEN   
    divGame$$.innerHTML = '';
    conclusion$$.innerHTML = '';
//MAPEO DE LAS RESPUESTAS, PREGUNTAS Y CATEGORIAS    
    correctAnswers = questionDataRes.results.map(question => (question.correct_answer));
    incorrectAnswers = questionDataRes.results.map(question => (question.incorrect_answers));
    questionTest = questionDataRes.results.map(question => (question.question));
    questionCategory = questionDataRes.results.map(question => (question.category));
//BUCLE PARA PRESENTAR LAS PREGUNTAS
    for (let i = 0; i < input$$.value; i++) {
        const printQuestion$$ = document.createElement('h3');
        divGame$$.appendChild(printQuestion$$);
//DEPURACION DE LAS PREGUNTAS QUITANDO CARACTERES EXTRAÑOS
        let correctedQuestion = questionTest[i].replace(/&quot;/g, "'");
        correctedQuestion = correctedQuestion.replace(/&#039;/g, "'");
        correctedQuestion = correctedQuestion.replace(/&eacute;/g, "é");
        correctedQuestion = correctedQuestion.replace(/&ldquo;/g, '"');
        correctedQuestion = correctedQuestion.replace(/&rdquo;/g, '"');
//CONTENIDO DE LA PREGUNTA
        printQuestion$$.innerText = `${i+1}: Category: ${questionCategory[i]} ==> ${correctedQuestion}`;
//RESPUESTAS JUNTADAS Y BARAJADAS POR CADA ITERACION
        allAnswers[i] = [correctAnswers[i], ...incorrectAnswers[i]];
        let randomAnswers = shuffle(allAnswers[i]);
//CREACION DE ELEMENTOS DE LA PREGUNTA Y RESPUESTAS POR CADA ITERACION
        const printAnswers$$ = document.createElement('form');
        const selectAnswers$$ = document.createElement('select');
        printAnswers$$.appendChild(selectAnswers$$);
        divGame$$.appendChild(printAnswers$$);
//CONTENIDO DE LAS RESPUESTAS POR CADA ITERACION DE UN SUBBUCLE        
        for(let j = 0; j < randomAnswers.length; j++){
            selectAnswers$$.innerHTML += `<option value="${[j]}">${randomAnswers[j]}</option>`
        };

        checkButton$$.addEventListener('click', () => {
            if (i == 0){ //PARA QUE CUANDO SE PULSE EL BOTON SE VACÍEN LOS CONTENIDOS Y LOS CONTADORES
                conclusion$$.innerText = '';
                countCorrect = 0;
            };  
         //LECTURA DE LAS RESPUESTAS SELECCIONADAS   
            selectedAnswers = [];
            const selectedValues = [].filter
                .call(selectAnswers$$.options, option => option.selected)
                .map(option => option.text);
            selectedAnswers.push(selectedValues[0]); //POR CADA ITERACION SOLO DEVUELVE UN ARRAY DE UN VALOR CADA VEZ

            //COMPROBACION DE LA RESPUESTA SELECCIONADA
            if (correctAnswers[i] == selectedAnswers[0]){
              countCorrect++;
              printQuestion$$.style.color ="lightgreen";  
            } else {
                printQuestion$$.style.color ="red";
            };
            // AL LLEGAR AL FINAL SE CREA LA CONCLUSION
            if (i == input$$.value-1) {
                const conclusionMessage$$ = document.createElement('div');
                conclusion$$.appendChild(conclusionMessage$$);
                let porcentaje = Math.round((countCorrect/input$$.value)*100);
                conclusionMessage$$.innerHTML = `<h3 class="mensaje">Has acertado ${countCorrect} de ${input$$.value} preguntas (${porcentaje}%)</h3>`;
            };        
        });   
    };     
 };
    
startButton$$.addEventListener('click', loadQuestions);
// FUNCION PARA BARAJAR LAS RESPUESTAS PARA QUE LA RESPUESTA CORRECTA APAREZCA EN UN LUGAR ALEATORIO
function shuffle(arr) {
    let newArr = arr;
    let k = Math.floor(Math.random() * (newArr.length));
    [newArr[0], newArr[k]] = [newArr[k], newArr[0]];
    return newArr;
};