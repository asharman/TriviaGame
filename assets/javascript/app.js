var game = {
    activeQuestion: {},
    currentQuestion: 0,
    wrongAnswer: 0,
    rightAnswer: 0,
    answerGuessed: "",
    timer: 15,
    timeout: "",
    clock: "",
    clicked : false,

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

    resetGame: function () {
        this.currentQuestion = 0;
        this.answerGuessed = "";
        this.rightAnswer = 0;
        this.wrongAnswer = 0;
        game.loadQuestion();
    },

    loadQuestion: function () {
        for (i in this.questions) {
            if (this.currentQuestion === 10) {
                $("#questionCol").empty()
                $("#answerCol").empty()
                $("#time-col").empty()
                $("#gifColumn").empty()
                game.gameOverDisplay();

            } else if (this.questions[i].questionNumber === this.currentQuestion) {
                game.timerCount();
                game.displayQuestion(game.questions[i]);
                game.timeout = setTimeout(function () {
                    game.checkAnswer(game.answerGuessed, game.questions[game.currentQuestion])
                }, 15000);
            }
        }
    },

    displayQuestion: function (q) {
        activeQuestion = q;
        $("#questionCol").html(`<h1 id='question' class="display-4">Question ${q.questionNumber + 1}</h1>`);
        $("#questionCol").append(`<h2>${q.question}</h2>`);
        $("#time-col").html(`<h2>Seconds remaining: ${game.timer}</h2>`);
        $("#gifColumn").empty();
        game.clicked = false;
        let randomOrder = [];
        let setOrder = [];
        for (i in q.answers) {setOrder.push(q.answers[i])}
        console.log(`${setOrder}`);
        
        for (i = 0; i < 4; i++) {
            let randomIndex = Math.floor(Math.random() * setOrder.length);
            randomOrder.push(setOrder.splice(randomIndex, 1));
        }
        $("#answerCol").html(`<h4 id='icon'>h <span class='answer'>${randomOrder[0]}</span></h4>`);
        $("#answerCol").append(`<h4 id='icon'>i <span class='answer'>${randomOrder[1]}</span></h4>`);
        $("#answerCol").append(`<h4 id='icon'>j <span class='answer'>${randomOrder[2]}</span></h4>`);
        $("#answerCol").append(`<h4 id='icon'>f <span class='answer'>${randomOrder[3]}</span></h4>`);

    },

    checkAnswer: function (a, q) {
        clearTimeout(game.timeout);
        clearInterval(game.clock);
        console.log(`${a}`);
        console.log(`${q.correctAnswer}`);

        if (a === q.correctAnswer) {
            console.log(`Correct!`);
            game.rightAnswer++;
            $("#gifColumn").html(`<img src='assets/images/correct.gif'>`);
            game.currentQuestion++
            setTimeout(function () {
                game.loadQuestion();
            }, 3000);
        } else {
            console.log(`Wrong!`);
            game.wrongAnswer++;
            $("#gifColumn").html(`<img src='assets/images/incorrect.gif'>`);
            game.currentQuestion++
            setTimeout(function () {
                game.loadQuestion();
            }, 3000);
        }
    },

    timerCount: function () {
        game.timer = 15;
        game.clock = setInterval(function () {
            game.timer--;
            $("#time-col").html(`<h2>Seconds remaining: ${game.timer}</h2>`);
        }, 1000);
    },

    gameOverDisplay: function() {
        $("#questionCol").html(`<h1 class="display-4">Game Over!</h1>`);
        $("#time-col").html(`<h4>Correct: ${game.rightAnswer} Incorrect: ${game.wrongAnswer}</h4>`);
        $("#gifColumn").html(`<button id='restart' class='btn'>Restart</button>`);
    }

}

//When you click the start button load question 1
$("#questionCol").on("click","#startGame", function () {
    game.loadQuestion();
});

$("#answerCol").on("click", ".answer", function () {
    if (game.clicked === false) {
        game.answerGuessed = $(this).text();
        game.checkAnswer(game.answerGuessed, game.questions[game.currentQuestion]);
        game.clicked = true;
    }
});

$("#gifColumn").on("click","#restart", function() {
    game.resetGame();
})


