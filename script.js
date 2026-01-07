let level = 1, score = 0, streak = 0, timeLeft = 15, timer;
let usedQuestions = new Set(), currentQuestion, category="all", playerName="Guest";

const qEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const feedbackEl = document.getElementById("feedback");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");
const statsEl = document.getElementById("stats");
const gameScreenEl = document.getElementById("gameScreen");
const categorySelectEl = document.getElementById("categorySelect");
const playerNameEl = document.getElementById("playerName");

const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");

// Generate category buttons dynamically
categories.forEach(cat=>{
  const btn = document.createElement("button");
  btn.textContent = cat;
  btn.onclick = ()=>startGame(cat);
  categorySelectEl.appendChild(btn);
});

function startGame(selectedCategory){
  category = selectedCategory;
  playerName = prompt("Enter your name:", "Guest") || "Guest";
  playerNameEl.textContent = "Player: " + playerName;
  categorySelectEl.classList.add("hidden");
  statsEl.classList.remove("hidden");
  gameScreenEl.classList.remove("hidden");
  getNextQuestion();
}

function getNextQuestion() {
  const available = questions.filter(
    q => !usedQuestions.has(q.id) &&
         (q.category === category || category === "all") &&
         q.difficulty <= Math.ceil(level/3)
  );

  if(available.length===0){ endGame(); return; }

  currentQuestion = available[Math.floor(Math.random()*available.length)];
  usedQuestions.add(currentQuestion.id);

  qEl.textContent = currentQuestion.question;
  optionsEl.innerHTML = "";
  currentQuestion.options.forEach(opt=>{
    const btn=document.createElement("button");
    btn.textContent=opt;
    btn.onclick=()=>checkAnswer(opt);
    optionsEl.appendChild(btn);
  });

  resetTimer();
}

function checkAnswer(selected){
  clearInterval(timer);
  if(selected===currentQuestion.answer){
    streak++; score+=10+streak*2; level++;
    feedbackEl.textContent="✅ Correct!"; correctSound.play();
  } else {
    streak=0; feedbackEl.textContent=`❌ Wrong! Answer: ${currentQuestion.answer}`; wrongSound.play();
  }
  updateStats();
  setTimeout(()=>{feedbackEl.textContent=""; getNextQuestion();},1000);
}

function resetTimer(){
  clearInterval(timer);
  timeLeft = Math.max(5, 15 - Math.floor(level/5));
  timerEl.textContent = `⏱ ${timeLeft}`;
  timer=setInterval(()=>{
    timeLeft--; timerEl.textContent=`⏱ ${timeLeft}`;
    if(timeLeft<=0){ clearInterval(timer); streak=0; feedbackEl.textContent="⏰ Time up!"; setTimeout(getNextQuestion,1000); }
  },1000);
}

function updateStats(){
  levelEl.textContent=`Level: ${level}`;
  scoreEl.textContent=`Score: ${score}`;
}

function endGame(){
  qEl.textContent=""; optionsEl.innerHTML="";
  gameScreenEl.classList.add("hidden");
  statsEl.classList.add("hidden");
  gameOverEl.classList.remove("hidden");
  finalScoreEl.textContent=`Final Score: ${score}`;
  saveLeaderboard(playerName, score);
  displayLeaderboard();
}

function restartGame(){
  level=1; score=0; streak=0; usedQuestions.clear();
  gameOverEl.classList.add("hidden");
  categorySelectEl.classList.remove("hidden");
    }
