# Deploy på Google App Engine

Noen korte kommentarer

Stå i roten av prosjektet.

1. kopierer package.json for backend til roten så vi kan deploye derfra.
2. installer frontend
3. bygg frontend
4. kjør deploy kommando

Du må være logget inn i gcloud cli og ha rettigheter til
prosjektet for å kunne gjøre dette fra egen maskin.

```
cp ./frontend/src/paths.json . && cp ./backend/package.json .
npm ci --ignore-scripts --no-optional --prefer-offline --no-audit --prefix frontend
npm run build --prefix frontend
gcloud app deploy --quiet --project=lessoneditor
```

For å lese logger:

```
gcloud app logs tail -s default --project=lessoneditor
```

Eller man kan logge seg inn i Google Cloud Console.
