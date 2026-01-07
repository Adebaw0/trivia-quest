function getLeaderboard() {
  const lb = JSON.parse(localStorage.getItem("triviaLeaderboard")) || [];
  return lb.sort((a,b)=>b.score-a.score).slice(0,5);
}

function saveLeaderboard(name, score) {
  const lb = JSON.parse(localStorage.getItem("triviaLeaderboard")) || [];
  lb.push({name, score});
  localStorage.setItem("triviaLeaderboard", JSON.stringify(lb));
}

function displayLeaderboard() {
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  getLeaderboard().forEach(entry=>{
    const li = document.createElement("li");
    li.textContent = `${entry.name} - ${entry.score}`;
    list.appendChild(li);
  });
}
