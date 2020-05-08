const fs = require('fs');
const writeDir = 'lessonFiles';

const handleSubmit= (requestBody) => {
  writeToFile([YAMLstateToString(requestBody.yaml), requestBody.markdown.content], requestBody.yaml.title, requestBody.yaml.title,  'md');
  writeToFile(YMLstateToString(requestBody.yml), requestBody.yaml.title, 'lesson', 'yml');
};

const writeToFile = (content, lessonName, fileName, extension) => {
  console.log('Writing to file');
  if (extension === 'md') {
    content = content[0] + `\n\n` + content[1];
  }
  isDirectory(lessonName);
  fs.writeFile(`${writeDir}\\${lessonName}\\${fileName}.${extension}`, content, err => {
    if (err) {
      console.log(err);
      return
    }
    console.log('File written successfully')
  })
};


const isDirectory = (lessonDir) => {
  if (!fs.existsSync(writeDir)) {
    fs.mkdirSync(writeDir);
  }
  if (!fs.existsSync(`${writeDir}\\${lessonDir}`)) {
    fs.mkdirSync(`${writeDir}\\${lessonDir}`)
  }
};


const YMLstateToString = (input) =>{
  return (
      "level: " +
      input.level +
      (input.license ? "\nlicense: " + input.license : "") +
      "\ntags:\n    topics: [" +
      input.tags.topics +
      "]\n    subjects: [" +
      input.tags.subjects +
      "]\n    grades: [" +
      input.tags.grades +
      "]"
  );
};


const YAMLstateToString = (input) => {
  return (
      "---\ntitle: " +
      input.title +
      "\nauthor: " +
      input.author +
      (input.translator ? "\ntranslator: " + input.translator : "") +
      "\nlanguage: " +
      input.language +
      "\n---"
  );
};

module.exports = handleSubmit;