import Markdown from 'markdown-it';


const md = new Markdown();
const attrs = require('markdown-it-attrs');
md.use(attrs);

/*
Todo: Add code for handling sections,
 lists and code (might be able to do
 this with markdown-it plugins).
*/

export const mdParser = (content) => {
    return md.render(content);
};