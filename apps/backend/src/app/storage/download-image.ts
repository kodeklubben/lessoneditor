import axios from "axios";


const downloadImage = async (url) => {
    try {
        const response: any = await axios.get(url, {
            responseType: "arraybuffer",
        });
        return Buffer.from(response.data, "binary");
    } catch (e) {
        return null;
    }
};


export default downloadImage;
