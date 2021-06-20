// https://cloudfunction-fu.google.com/thumb?url=dfsa&token=xyz

## Deploy
Deployment is not automated.

To deploy the app to Google Cloud Functions first be sure to be logged into Google Cloud.
`gcloud auth login` with an account that have access to the lessoneditor project.

First build the code with `npm run build thumbnailer`

Then run the deploy-command from the root of the project:
```
gcloud functions deploy thumbnailer \
    --region=europe-west1 \
    --allow-unauthenticated \
    --runtime=nodejs14 \
    --memory=1024MB \
    --project=lessoneditor \
    --source=dist/apps/thumbnailer \
    --trigger-http
```

## Test the application in production

https://europe-west1-lessoneditor.cloudfunctions.net/thumbnailailer

https://lessoneditor.ew.r.appspot.com/preview/microbit/pxt_gangespill/gangespill
token=
