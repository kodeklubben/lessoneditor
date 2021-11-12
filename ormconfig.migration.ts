module.exports = {
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "github-actions@lessoneditor.iam",
  "database": "lessoneditor",
  "password": "ya29.c.b0AXv0zTMpohEHE8eZi9ajkazJh-rD0nOkkE-6K0QqSBcku5lBAd7U7UmpC86ZF_Xt7bXlkGVkdRFt1cL5RV8W4AsmBIGJqeHgMJMq_62qqJPNX-KvGPb0rqO0THKvBSAab24CnrSg4idjKh6huLYXH2-BAeQE33wjwffJAaX9DND3Ff4h8zXxLUj2AsOyfXkODO3l5eC9xmPhYssasvdyXaMOH0OFFBMVmW6FE4bs",
  "synchronize": false,
  "logging": false,
  "entities": [
    "apps/nestbackend/src/user/user.entity.ts",
    "apps/nestbackend/src/lesson/lesson.entity.ts",
    "apps/nestbackend/src/session/session.entity.ts"
  ],
  "migrations": ["db/migration/**/*.ts"],
  "cli": {
    "migrationsDir": "db/migration"
  }
}
