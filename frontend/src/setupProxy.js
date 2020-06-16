function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = function (app) {
  app.get("/api/oppgaver", function (req, res) {
    const oppgaver = [];
    const antallOppgaver = getRandomInt(7);
    for (let step = 0; step < antallOppgaver; step++) {
      const prefix = ["Oppgave", "Utfordring", "Quiz"]
        .sort(() => 0.5 - Math.random())
        .pop();
      const postfix = ["lua", "python", "haskell"]
        .sort(() => 0.5 - Math.random())
        .pop();
      oppgaver.push(prefix + " " + postfix);
    }
    res.send(oppgaver);
  });
};
