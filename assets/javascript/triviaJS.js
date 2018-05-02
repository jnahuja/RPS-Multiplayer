$(document).ready(function () {



    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB5L5pzcQUp8yBn60-khV7yPO46UIBCHQw",
        authDomain: "rps-game-a510f.firebaseapp.com",
        databaseURL: "https://rps-game-a510f.firebaseio.com",
        projectId: "rps-game-a510f",
        storageBucket: "rps-game-a510f.appspot.com",
        messagingSenderId: "396960741334"
    };
    firebase.initializeApp(config);

    var database = firebase.database();



    var rpsArray = ["Rock", "Paper", "Scissors"];
    var gameBoxArray = ["#gameBoxLeft", "#gameBoxRight"];
    var winsLossesDiv = ["#winsLossesDivLeft", "#winsLossesDivRight"];

    var player1 = {
        name: "",
        wins: 0,
        losses: 0
    }

    var player2 = {
        name: "",
        wins: 0,
        losses: 0
    }

    var gamePlay = {
        turn: 1,
        player1Guess: "",
        player2Guess: "",
        winner: ""
    }

    function player1Reset() {
        player1.name = "";
        player1.wins = 0;
        player1.losses = 0;
    }

    function player2Reset() {
        player2.name = "";
        player2.wins = 0;
        player2.losses = 0;
    }

    function gamePlayReset() {
        gamePlay.turn = 1;
        gamePlay.player1Guess = "";
        gamePlay.player2Guess = "";
        gamePlay.winner = "";
        database.ref().child("/gamePlay").set(gamePlay);
    }

    function buildRPS() {

        console.log("In buildRPS function")

        for (j = 0; j < gameBoxArray.length; j++) {
            $(gameBoxArray[j]).empty();

            for (i = 0; i < rpsArray.length; i++) {
                var answerDiv = $("<div>");
                answerDiv.addClass("row justify-content-center");

                var buttonDiv = $("<button>");
                buttonDiv.addClass("rpsButton");
                buttonDiv.attr("RPS", rpsArray[i]);
                buttonDiv.attr("gameBox", gameBoxArray[j]);
                // buttonDiv.attr("data-answer", i);
                buttonDiv.text(rpsArray[i]);

                $(gameBoxArray[j]).append(answerDiv);
                answerDiv.append(buttonDiv);
            }
        }

        updateWinsLosses();
    }

    buildRPS();

    function playerWaiting() {
        console.log("player waiting function");
        for (j = 0; j < gameBoxArray.length; j++) {
            $(gameBoxArray[j]).empty();
            var p = $("<p>");
            p.addClass("row justify-content-center playerTitle");
            p.text("Player " + (j + 1) + " Waiting");
            $(gameBoxArray[j]).append(p);
            updateWinsLosses();
        }
    }

    // playerWaiting();

    function updateWinsLosses() {
        for (j = 0; j < winsLossesDiv.length; j++) {
            $(winsLossesDiv[j]).empty();
            var p = $("<p>");
            p.addClass("row justify-content-center playerWinsLosses");
            if (j == 0) {
                p.text("Wins = " + player1.wins + "   ------   Losses = " + player1.losses);
            }
            else if (j == 1) {
                p.text("Wins = " + player2.wins + "   ------   Losses = " + player2.losses);
            }

            $(winsLossesDiv[j]).append(p);
        }
    }

    function gameBoxCenterInstructions() {
        $("#gameBoxCenter").empty();
        var p = $("<p>");
        if (gamePlay.turn!==3) {
            p.text("Player "+gamePlay.turn+"'s Turn");
        }
        else if (gamePlay.winner == "Draw") {
            p.text("It's a Draw!");
            setTimeout(gamePlayReset,3000);
            // setTimeout(function() {
            //     database.ref().child("/gamePlay").set(gamePlay);
            //   }, 4000);
            
        }
        else {
            p.text("The Winner is " + gamePlay.winner+ "!");
            setTimeout(gamePlayReset,3000);
            // setTimeout(function() {
            //     database.ref().child("/gamePlay").set(gamePlay);
            // }, 4000);
        }
        
        // if (gamePlay.turn==1) {
        //     p.text("Player 1's Turn");
        // }
        // else if (gamePlay.turn==2) {
        //     p.text("Player 2's Turn");
        // }
        $("#gameBoxCenter").append(p);
    }


    // Before we do anything else with button-clicks, we should add a listener that gets the data in the database, and updates the UI based on whether Player1 or Player2 exists in the database and who's turn it is

    database.ref().on("value", function(snapshot) {

        if (!snapshot.child("/player1").exists() && !snapshot.child("/player2").exists()) {
            console.log("No existance");
            $("#headerText").empty();
            $("#headerText").text("Enter Player 1!");
            player1Reset();
            player2Reset();
        }
        else if (snapshot.child("/player1").exists() && !snapshot.child("/player2").exists()) {
            console.log("Player 1 exists");
            $("#headerText").text("Enter Player 2!");
            player2Reset();
        }
        else if (snapshot.child("/player1").exists() && snapshot.child("/player2").exists()) {
            console.log("Player 2 exists");
            $("#headerText").text("Game On!");

            if (snapshot.child("/gamePlay/turn").val()==1) {
                console.log("player 1's turn");
                // Update Div to Display Player 1's Turn Text
                gameBoxCenterInstructions();
            }
            else if (snapshot.child("/gamePlay/turn").val()==2) {
                console.log("player 2's turn");
                // Update Div to Display Player 2's Turn Text
                gameBoxCenterInstructions();
            }
            else {
                gameBoxCenterInstructions();
                updateWinsLosses();
            }
            
        }
        else {
            alert("Something has gone wrong. Let's try that again.")
            player1Reset();
            player2Reset();
            database.ref().empty();
        }
        
    });













    $("#submit-item").on("click", function (event) {
        event.preventDefault();

        // Get the input values
        var playerName = $("#player-name").val().trim();
        console.log(playerName);

        if (player1.name=="") {
            player1.name = playerName;
            // database.ref().set({
            //     player1: player1,
            // });

            // Add player1 to the database
            database.ref().child("/player1").set(player1);


            // // Set the turn value to 1, as player1 goes first
            // database.ref().child("/turn").set(1);

            // // If this user disconnects by closing or refreshing the browser, remove the user from the database
            // database.ref("/players/player1").onDisconnect().remove();






        }
        else if (player2.name=="") {
            player2.name = playerName;
            database.ref().child("/player2").set(player2);
            gamePlayReset();
            // database.ref().child("/gamePlay").set(gamePlay);
            // database.ref().set({
            //     player2: player2,
            // });
        }


        // database.ref().on("value", function (snapshot) {

        //     console.log(snapshot.val().player1);
        //     console.log("In snapshot");
        //     // console.log(snapshot.child(player1));

        //     // If player1 is not defined in the database
        //     if (snapshot.child("player1").exists() == false) {
        //         player1.name = playerName;
        //         database.ref().set({
        //             player1: player1,
        //         });
        //     }
        //     // Else If player2 is not defined in the database
        //     else if (snapshot.child("player2").exists() == false) {
        //         player2.name = playerName;
        //         database.ref().set({
        //             player2: player2,
        //         });
        //     }
        // });
        
    });


    $(document).on("click", ".rpsButton", function () {

        var currentRPS = $(this).attr("RPS");
        var currentGameBox = $(this).attr("gameBox");
        console.log(currentRPS);
        console.log(currentGameBox);
        console.log(gamePlay.turn);

        // database.ref().set({
        //     packingList: tempArray,
        // });

        if (currentGameBox=="#gameBoxLeft" && gamePlay.turn==1) {
            gamePlay.player1Guess = currentRPS;
            gamePlay.turn = 2;
            database.ref().child("/gamePlay").set(gamePlay);
        }

        else if (currentGameBox=="#gameBoxRight" && gamePlay.turn==2) {
            gamePlay.player2Guess = currentRPS;
            gamePlay.turn = 3;

            // If Player 1 wins
            if ((gamePlay.player1Guess=="Rock" && gamePlay.player2Guess=="Scissors") || (gamePlay.player1Guess=="Scissors" && gamePlay.player2Guess=="Paper") || (gamePlay.player1Guess=="Paper" && gamePlay.player2Guess=="Rock")) {
                player1.wins = player1.wins + 1;
                player2.losses = player2.losses + 1;
                gamePlay.winner = player1.name;
            }
            else if ((gamePlay.player1Guess=="Rock" && gamePlay.player2Guess=="Paper") || (gamePlay.player1Guess=="Scissors" && gamePlay.player2Guess=="Rock") || (gamePlay.player1Guess=="Paper" && gamePlay.player2Guess=="Scissors")) {
                player1.losses = player1.losses + 1;
                player2.wins = player2.wins + 1;
                gamePlay.winner = player1.name;
            }
            else {
                gamePlay.winner = "Draw";
            }

            database.ref().child("/gamePlay").set(gamePlay);
            database.ref().child("/player1").set(player1);
            database.ref().child("/player2").set(player2);
        }

        // var tempArray = [];
        // database.ref().on("value", function (snapshot) {
        //     tempArray = snapshot.val().packingList;
        //     console.log("TempArray in delete function= " + tempArray);
        // });

        // // Deletes the item marked for deletion
        // tempArray.splice(currentIndex, 1);

        // console.log("TempArray after splice " + tempArray);

        // database.ref().set({
        //     packingList: tempArray,
        // });

        // putOnPage(tempArray);
    });














    //     // Initialize the variables
    //     var currentTriviaQuestion = "";
    //     var currentCorrectAnswer = "";
    //     var currentTriviaAnswers = []; // ["", "", "", ""];
    //     var questionCounter = 0;
    //     var wins = 0;
    //     var losses = 0;
    //     var answerIndex = ["A. ", "B. ", "C. ", "D. "];

    //     // Sample of the triviaQuestions array that is dynamically updated as the program runs
    //     // var triviaQuestions = [{
    //     //     questionNumber: 0,
    //     //     question: "",
    //     //     correctAnswer: "",
    //     //     incorrectAnswers: ["","",""]
    //     // }];

    //     var triviaQuestions = [];

    //     var main = $("body");
    //     var btns = main.find("button");

    //     function initialize() {
    //         triviaQuestions = [];
    //         currentTriviaQuestion = "";
    //         currentTriviaAnswers = []; // ["", "", "", ""];
    //         questionCounter = 0;
    //     }


    //     // "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple"

    //     // Function to make a call to a trivia API and store the results in a Trivia Object for each game
    //     function ajaxTriviaCall(difficulty) {

    //         var queryURL = "https://opentdb.com/api.php?amount=5&difficulty="+difficulty+"&type=multiple"

    //         $.ajax({
    //           url: queryURL,
    //           method: "GET"
    //         }).then(function (response) {
    //             console.log("In Ajax Call");
    //             console.log(response);

    //             for (i=0; i<response.results.length; i++) {
    //                 // triviaQuestions
    //                 var questionObject = {}
    //                 questionObject.questionNumber = difficulty + "_" + i;
    //                 questionObject.question = response.results[i].question;
    //                 questionObject.correctAnswer = response.results[i].correct_answer;
    //                 questionObject.incorrectAnswers = response.results[i].incorrect_answers;
    //                 triviaQuestions.push(questionObject);
    //                 // console.log(questionObject);
    //             }

    //             // triviaQuestions[0].question = response.results[0].question;;
    //             // console.log(triviaQuestions);
    //         });
    //     }

    //     // Function to build the trivia questions array by completing 3 AJAX calls for questions of different difficulties. Each AJAX call brings back 5 questions. The game "Who Wants to Be a Millionaire" has 15 questions.
    //     function buildTriviaQuestions() {
    //         ajaxTriviaCall("easy");
    //         ajaxTriviaCall("medium");
    //         ajaxTriviaCall("hard");
    //     }

    //     // The Begin function creates our initial Div with a Begin Button to start the game.
    //     function begin() {

    //         var answerDiv = $("<div>");
    //         answerDiv.addClass("row justify-content-center");

    //         var answerDivLeftTriangle = $("<div>");
    //         answerDivLeftTriangle.addClass("triangleLeft");

    //         var answerDivRightTriangle = $("<div>");
    //         answerDivRightTriangle.addClass("triangleRight");

    //         var buttonDiv = $("<button>");
    //         buttonDiv.addClass("beginButton");
    //         // buttonDiv.attr("data-answer", i);
    //         buttonDiv.text("Begin");

    //         $("#triviaQuestion").append(answerDiv);
    //         answerDiv.append(answerDivLeftTriangle);
    //         answerDiv.append(buttonDiv);
    //         answerDiv.append(answerDivRightTriangle);
    //     }

    //     // Function to display the next trivia question and answers in the div
    //     function displayTriviaQuestion(answerPosition) {

    //         // $("#triviaAnswers").empty();
    //         console.log("In display answers function");
    //         $("#triviaQuestion").empty();

    //         var questionDiv = $("<div>");
    //         questionDiv.addClass("row justify-content-center");

    //         var questionDivLeftTriangle = $("<div>");
    //         questionDivLeftTriangle.addClass("triangleLeft");

    //         var questionDivRightTriangle = $("<div>");
    //         questionDivRightTriangle.addClass("triangleRight");

    //         var questionButtonDiv = $("<button>");
    //         questionButtonDiv.addClass("triviaQuestionButton");
    //         questionButtonDiv.html(currentTriviaQuestion).text();

    //         $("#triviaQuestion").append(questionDiv);
    //         questionDiv.append(questionDivLeftTriangle);
    //         questionDiv.append(questionButtonDiv);
    //         questionDiv.append(questionDivRightTriangle);
    //         // $("#triviaQuestion").html(currentTriviaQuestion).text();

    //         $("#firstAnswerColumn").empty();
    //         $("#secondAnswerColumn").empty();



    //         // Looping through the array of questions
    //         for (var i = 0; i < 4; i++) {

    //           var answerDiv = $("<div>");
    //           answerDiv.addClass("row justify-content-center answerBlock");

    //           var answerDivLeftTriangle = $("<div>");
    //           answerDivLeftTriangle.addClass("triangleLeft");

    //           var answerDivRightTriangle = $("<div>");
    //           answerDivRightTriangle.addClass("triangleRight");


    //           var buttonDiv = $("<button>");
    //           buttonDiv.addClass("triviaAnswer");
    //           buttonDiv.addClass("answerButton");
    //           if (i==answerPosition) {
    //             buttonDiv.attr("answer-review", "correct");
    //           }
    //           else {
    //             buttonDiv.attr("answer-review", "incorrect");
    //           }
    //           //   buttonDiv.attr("data-answer", i);
    //         //   buttonDiv.attr("answerCorrect", i);
    //         //   buttonDiv.text(currentTriviaAnswers[i]);
    //         //   var answerContent = html(currentTriviaAnswers[i]);
    //         //   buttonDiv.text(answerContent + "ASDFADSF");
    //           buttonDiv.html("<span class='answerIndex'>"+answerIndex[i]+"</span>"+currentTriviaAnswers[i]).text();
    //         //   <span style="color:black">A. </span>

    //           if (i==0 || i==3) {
    //             $("#firstAnswerColumn").append(answerDiv);
    //           }
    //           else {
    //             $("#secondAnswerColumn").append(answerDiv);
    //           }

    //           answerDiv.append(answerDivLeftTriangle);
    //           answerDiv.append(buttonDiv);
    //           answerDiv.append(answerDivRightTriangle);
    //         }

    //         // Sample of the expected Div Output.
    // //         <div class="row justify-content-center answerButton">
    // //         <div class="triangleLeft"></div>
    // //         <button class="triviaAnswer" data-answer="1">Answer 1</button>
    // //         <div class="triangleRight"></div>
    // // </div>

    //     }


    //     // Function to get the current question from the triviaQuestions Array.
    //     function populateCurrentAnswers(questionIndex) {
    //         currentTriviaQuestion = "";
    //         currentCorrectAnswer = "";
    //         currentTriviaAnswers = [];
    //         currentTriviaQuestion = triviaQuestions[questionIndex].question;
    //         currentCorrectAnswer = triviaQuestions[questionIndex].correctAnswer;
    //         // console.log(currentTriviaQuestion);
    //         // console.log(triviaQuestions);
    //         var answerPosition = Math.floor(Math.random()*4);
    //         // console.log(answerPosition);
    //         var incorrectCounter = 0;
    //         for (i=0; i<4; i++) {
    //             // console.log("I iteration " + i);
    //             if (i==answerPosition) {
    //                 currentTriviaAnswers.push(triviaQuestions[questionIndex].correctAnswer)
    //             }
    //             else {
    //                 // console.log(incorrectCounter);
    //                 // console.log(triviaQuestions[0].incorrectAnswers[incorrectCounter]);
    //                 currentTriviaAnswers.push(triviaQuestions[questionIndex].incorrectAnswers[incorrectCounter]);
    //                 incorrectCounter = incorrectCounter + 1;
    //             }
    //         }
    //         console.log(currentTriviaAnswers);
    //         questionCounter = questionCounter + 1;
    //         // decodeString();
    //         displayTriviaQuestion(answerPosition);
    //     }

    //     // Function to reset our clock and get a new question.
    //     function runNewQuestion() {
    //         // $("#triviaQuestion").empty();
    //         // $("#firstAnswerColumn").empty();
    //         // $("#secondAnswerColumn").empty();
    //         // $("#triviaQuestion").text("That is Correct!");

    //         // if (questionCounter<15) {
    //         //     alert("You have Won the Game!")
    //         // }

    //         populateCurrentAnswers(questionCounter);

    //         stopwatch.reset();
    //         stopwatch.start();

    //     }

    //     // At the start of the game we need to display the "Begin" button and build our triviaQuestions array.
    //     begin();
    //     buildTriviaQuestions();
    //     // populateCurrentAnswers();

    //     // Our stopwatch object runs the timer and keeps track of the time for each question.
    //     var clockRunning = false;
    //     var stopwatch = {
    //         time: 30,
    //         reset: function() {      
    //           stopwatch.time = 30;
    //           // DONE: Change the "display" div to "00:00."
    //           $("#timer").text("30");
    //         },
    //         start: function() {
    //           // DONE: Use setInterval to start the count here and set the clock to running.
    //           if (!clockRunning) {
    //             intervalId = setInterval(stopwatch.count, 1000);
    //             clockRunning = true;
    //           }
    //         },
    //         stop: function() {

    //           // Use clearInterval to stop the count here and set the clock to not be running.
    //           clearInterval(intervalId);
    //           clockRunning = false;
    //         },
    //         count: function() {
    //           // Increment time by 1, remember we cant use "this" here.
    //           stopwatch.time = stopwatch.time - 1;
    //           // Get the current time, pass that into the stopwatch.timeConverter function, and save the result in a variable.
    //           var converted = stopwatch.timeConverter(stopwatch.time);
    //           if (converted == "00") {
    //             // $("#triviaQuestion").empty();
    //             losses = losses + 1;
    //             $("#winsDiv").text("Wins: "+ wins);
    //             $("#lossesDiv").text("Losses: "+losses);
    //             $("#firstAnswerColumn").empty();
    //             $("#secondAnswerColumn").empty();
    //             // $("#triviaQuestion").text('Time is up. The correct answer is "' + currentCorrectAnswer + '".');
    //             $(".triviaQuestionButton").text('Time is up. The correct answer is "' + currentCorrectAnswer + '".');
    //             stopwatch.stop();
    //             setTimeout(runNewQuestion,5000);
    //           }
    //           console.log(converted);
    //           // Use the variable we just created to show the converted time in the "display" div.
    //           $("#timer").text(converted);
    //         },
    //         timeConverter: function(seconds) {

    //           if (seconds < 10) {
    //             seconds = "0" + seconds;
    //           }
    //           return seconds;
    //         }
    //       };

    //     // Only applies to statically created buttons on the page's initial load
    //     $("button").on("click", function() {
    //         console.log("button click");
    //         // $("#triviaQuestion").empty();
    //         // console.log(triviaQuestions);
    //         populateCurrentAnswers(questionCounter);
    //         stopwatch.reset();
    //         // setInterval(stopwatch.count, 1000);
    //         stopwatch.start();

    //         // displayTriviaQuestion();
    //         // In this case, the "this" keyword refers to the button that was clicked
    //         // var person = $(this).attr("data-person");
    //     });

    //     // Function runs when the answer button is clicked.
    //     $("body").on("click", ".answerButton", function() {
    //         console.log("button click");
    //         console.log(this);
    //         console.log($(this).attr("answer-review"));

    //         if ($(this).attr("answer-review")=="correct") {
    //             // alert("correct");
    //             // displayCorrect();
    //             wins = wins + 1;
    //             $("#winsDiv").text("Wins: "+ wins);
    //             $("#lossesDiv").text("Losses: "+losses);
    //             $("#firstAnswerColumn").empty();
    //             $("#secondAnswerColumn").empty();
    //             $(".triviaQuestionButton").text("That is Correct!");
    //             stopwatch.stop();
    //             setTimeout(runNewQuestion,3000);

    //             // delayButtonAlert = setTimeout(function() {
    //             //     alert("Alert #2");
    //             //   }, 3000);

    //         }
    //         else {
    //             losses = losses + 1;
    //             $("#winsDiv").text("Wins: "+ wins);
    //             $("#lossesDiv").text("Losses: "+losses);
    //             $("#firstAnswerColumn").empty();
    //             $("#secondAnswerColumn").empty();
    //             $(".triviaQuestionButton").text('That is Incorrect. The correct answer is "' + currentCorrectAnswer + '".');
    //             stopwatch.stop();
    //             setTimeout(runNewQuestion,3000);
    //         }

    //     });
});