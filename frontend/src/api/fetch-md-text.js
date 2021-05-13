import paths from '../paths.json';
import axios from 'axios';
import resolveUrlTemplate from '../utils/resolve-url-template';

const fetchMdText = async (lessonId, file) => {
  let mdText = '';
  try {
    const tempFileUrl = resolveUrlTemplate(paths.DISPLAY_FILE, {
      lessonId,
      file,
    });
    const result = await axios.get(tempFileUrl + '.md');
    mdText = result.data;
  } catch (e) {
    console.error('No tempFile Found');
  }
  return mdText;
};

export default fetchMdText;
