// https://cloudfunction-fu.google.com/thumb?url=dfsa&token=xyz

## Deploy

```
gcloud functions deploy \
    --region=europe-west1 \
    --runtime=nodejs12 \
    --memory=1024MB \
    --project=lessoneditor \
    --trigger-http thumbnailService
```

## Test

https://europe-west1-lessoneditor.cloudfunctions.net/thumbnailService

https://lessoneditor.ew.r.appspot.com/preview/microbit/pxt_gangespill/gangespill
token=
