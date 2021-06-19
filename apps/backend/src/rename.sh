find . -type f -name "*.js" -exec echo {} \;

find . -type f -name "*.js" -exec rename 's/\.js/.ts/' '{}' \;
