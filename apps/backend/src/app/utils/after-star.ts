const afterStar = (starPattern, path) => {
    const len = starPattern.indexOf("*");
    return path.substring(len);
};

export default afterStar
