



Hvordan masse rename filer.
```
find . -type f -name "*.js" -exec rename 's/\.js/.ts/' '{}' \;
```
