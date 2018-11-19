// Initialize a variable for to target the fairy div with Jquery
let fairy = $("#fairy");

// A set of variables used to track the fairy and the mouse's position
let fairypos = {
    x: 0,
    y: 0,
};

let mousepos = {
    x: 0,
    y: 0,
}

let mouseMove = function (e) {
    mousepos.x = e.pageX;
    mousepos.y = e.pageY;
}

// A function to update the fairy's position in relation to the mouse position
let followMouse = function () {
    let distX = mousepos.x - fairypos.x;
    let distY = mousepos.y - fairypos.y;

    fairypos.x += distX / 5 + 5;
    fairypos.y += distY / 2 + 5;

    fairy.css(
        {
            "left": `${fairypos.x}px`,
            "top": `${fairypos.y}px`
        }
    );
}

// Main game object
let game = {
    // Active question object used to pull information on the question that is currently loaded
    activeQuestion: {},
    // The index of the current question
    currentQuestion: 0,
    //The counters of how many questions were answered correctly or incorrectly
    wrongAnswer: 0,
    rightAnswer: 0,
    // The string of the selected answer, used to compare to the current question's correct answer
    answerGuessed: "",
    // The timer that counts down
    timer: 15,
    //Initialized variables to reassign to the setInterval and setTimeout functions
    timeout: "",
    clock: "",
    //A variable that is used to prevent the user from clicking an answer multiple times
    clicked: false,
        
    // An array of the games questions
    questions: [
        {
            questionNumber: 0,
            question: "What is the name of the boat Link travels with in The Legend of Zelda: The Wind Waker?",
            answers: ["The King of Red Lions", "The Black Pearl", "S.S. Linebeck", "Triforce of Courage"],
            correctAnswer: "The King of Red Lions",
        },
        {
            questionNumber: 1,
            question: "Who is the Oracle of Secrets?",
            answers: ["Farore", "Din", "Nayru", "Zelda"],
            correctAnswer: "Farore",
        },
        {
            questionNumber: 2,
            question: "Which Nintendo character can be found on the Happy Mask Salesman's bag?",
            answers: ["Mario", "Pikachu", "Donkey Kong", "Samus"],
            correctAnswer: "Mario",
        },
        {
            questionNumber: 3,
            question: "What is the island Link washes up on in Link's Awakening?",
            answers: ["Koholint Island", "Outset Island", "Forsaken Fortress", "Hyrule"],
            correctAnswer: "Koholint Island",
        },
        {
            questionNumber: 4,
            question: "Which game is placed at the beginning of the official Zelda timeline?",
            answers: ["Skyward Sword", "Breath of the Wild", "Minish Cap", "Ocarina of Time"],
            correctAnswer: "Skyward Sword",
        },
        {
            questionNumber: 5,
            question: "How many years pass when Link pulls the Master Sword from it's pedastal in Ocarina of Time?",
            answers: ["Seven", "Thirteen", "Four", "Twenty"],
            correctAnswer: "Seven",
        },
        {
            questionNumber: 6,
            question: "In which game does Link hunt down Fused Shadows?",
            answers: ["Twilight Princess", "Majora's Mask", "Spirit Tracks", "Oracle of Ages"],
            correctAnswer: "Twilight Princess",
        },
        {
            questionNumber: 7,
            question: "Which game is the first in the series to not feature a playable instrument?",
            answers: ["Phantom Hourglass", "Link's Awakening", "Breath of the Wild", "Minish Cap"],
            correctAnswer: "Phantom Hourglass",
        },
        {
            questionNumber: 8,
            question: "Which of the following games has the most playable dungeons?",
            answers: ["A Link to the Past", "Ocarina of Time", "The Legend of Zelda", "Four Swords Adventures"],
            correctAnswer: "A Link to the Past",
        },
        {
            questionNumber: 9,
            question: "Which game is the only game in the series that has Heart Containers, but bosses do not drop them?",
            answers: ["The Adventure of Link", "Breath of the Wild", "Four Swords", "Tri-Force Heroes"],
            correctAnswer: "The Adventure of Link",
        },
        
    ],
    
    // Used to reset the game's variables 
    resetGame: function () {
        this.currentQuestion = 0;
        this.answerGuessed = "";
        this.rightAnswer = 0;
        this.wrongAnswer = 0;
        game.loadQuestion();
    },
    
    // Iterates through the array of questions and picks the question that the user is currently on
    loadQuestion: function () {
        for (i in this.questions) {
            // If the last question has been answered clear the screen and display the game over screen
            if (this.currentQuestion === 10) {
                $("#questionCol").empty()
                $("#answerCol").empty()
                $("#time-col").empty()
                $("#gif-column").empty()
                game.gameOverDisplay();
                
            // Otherwise start the timer and display the current question
            } else if (this.questions[i].questionNumber === this.currentQuestion) {
                game.timerCount();
                game.displayQuestion(game.questions[i]);
                // After 15 seconds run the check answer function and use whatever answer is selected, which would be no answer
                game.timeout = setTimeout(function () {
                    game.checkAnswer(game.answerGuessed, game.questions[game.currentQuestion])
                }, 15000);
            }
        }
    },
    
    // Display the information for the current question
    displayQuestion: function (q) {
        activeQuestion = q;
        $("#questionCol").html(`<h1 id='question' class="display-4">Question ${q.questionNumber + 1}</h1>`);
        $("#questionCol").append(`<h2>${q.question}</h2>`);
        $("#time-col").html(`<img src='assets/images/Phantom_Hourglass.png' class='hourglass'><span>${game.timer}</span>`);
        $("#gif-column").empty();
        game.clicked = false;
        // Initialize local variables to randomize the order in which the answers are displayed
        let randomOrder = [];
        let setOrder = [];
        for (i in q.answers) { setOrder.push(q.answers[i]) }
        console.log(`${setOrder}`);
        
        // Iterate through the array and push a random index into the randomized array
        for (i = 0; i < 4; i++) {
            let randomIndex = Math.floor(Math.random() * setOrder.length);
            randomOrder.push(setOrder.splice(randomIndex, 1));
        }

        // Display the answers to the answer row
        $("#answerCol").html(`<h4 id='icon'>h <span class='answer hvr-grow-shadow'>${randomOrder[0]}</span></h4>`);
        $("#answerCol").append(`<h4 id='icon'>i <span class='answer hvr-grow-shadow'>${randomOrder[1]}</span></h4>`);
        $("#answerCol").append(`<h4 id='icon'>j <span class='answer hvr-grow-shadow'>${randomOrder[2]}</span></h4>`);
        $("#answerCol").append(`<h4 id='icon'>f <span class='answer hvr-grow-shadow'>${randomOrder[3]}</span></h4>`);
        
    },
    
    // Check the selected answer for the correct answer in the current question
    checkAnswer: function (a, q) {
        // Assign a random number from 1 to 5 to select a random GIF when you get the answer right or wrong
        let randomGif = Math.floor(Math.random()*5+1);

        // Clear the setInterval and setTimout
        clearTimeout(game.timeout);
        clearInterval(game.clock);
        console.log(`${a}`);
        console.log(`${q.correctAnswer}`);

        // If the answer is correct add 1 to correct answer score and display a gif
        if (a === q.correctAnswer) {
            console.log(`Correct!`);
            game.rightAnswer++;
            $("#gif-column").html(`<img src='assets/images/correct${randomGif}.gif' style='width: 250px; height: auto'>`);

            // Move the question index up one and load the next question in 3 seconds
            game.currentQuestion++
            setTimeout(function () {
                game.loadQuestion();
            }, 3000);
            
            // If the answer is incorrect add 1 to incorrect answer score and display a gif
        } else {
            console.log(`Wrong!`);
            game.wrongAnswer++;
            $("#gif-column").html(`<h2>Correct answer: ${q.correctAnswer}`);
            $("#gif-column").append(`<img src='assets/images/incorrect${randomGif}.gif' style='width: 250px; height: auto'>`);

            // Move the question index up one and load the next question in 3 seconds
            game.currentQuestion++
            setTimeout(function () {
                game.loadQuestion();
            }, 3000);
        }
    },
    
    // Set the timer to 15 and count down every second and display the updated time
    timerCount: function () {
        game.timer = 15;
        game.clock = setInterval(function () {
            game.timer--;
            $("#time-col").html(`<img src='assets/images/Phantom_Hourglass.png' class='hourglass'><span>${game.timer}</span>`);
        }, 1000);
    },
    
    // Display the game over screen with the amount of questions guessed correctly and incorrectly
    gameOverDisplay: function () {
        $("#questionCol").html(`<h1 class="display-4">Game Over!</h1>`);
        $("#time-col").html(`<h4>Correct: ${game.rightAnswer} Incorrect: ${game.wrongAnswer}</h4>`);
        $("#gif-column").html(`<button id='restart' class='btn'>Restart</button>`);
    }
    
}

// Update the position the fairy every 50 milliseconds
setInterval(followMouse, 50);

//When you click the start button load question 1
$("#time-col").on("click", "#startGame", function () {
    game.loadQuestion();
});

// When you click on an answer plug it into the check answer function
$("#answerCol").on("click", ".answer", function () {
    if (game.clicked === false) {
        game.answerGuessed = $(this).text();
        game.checkAnswer(game.answerGuessed, game.questions[game.currentQuestion]);
        game.clicked = true;
    }
});

// Run the reset game function when you click on the reset button
$("#gif-column").on("click", "#restart", function () {
    game.resetGame();
});

// Track the mouse's position for the fairy to follow
$(document).on("mousemove", mouseMove);