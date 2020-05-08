const workDir = 'D:\\Skole\\kodeklubben\\testRepo\\simpleGitTest';
const simpleGit = require('simple-git')(workDir);

// Todo: Set up env for repo. Check if inside repo. Add

const cloneRepo = (repoPath) => {
  simpleGit.clone(repoPath, workDir);
};


const pushOnSubmit = (lessonPath) => {
  const commitMsg = `Lesson editor automatically added a new lesson: ${lessonPath}`;
  //simpleGit.add(`./*`);
  //simpleGit.commit(commitMsg);
  console.log('Commiting with simpleGit and Commit message was: ' + commitMsg);
  //simpleGit.push();
  console.log('Pushing with simpleGit');
};

module.exports = pushOnSubmit;