# Database




## To create new migrations

You can use this convinient command to create migration files. It just
uses the git branch name and typeorm will prefix with a timestamp.

```bash
typeorm migration:create ./migration/$(git branch --show-current)
```
