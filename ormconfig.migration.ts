module.exports = {
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "github-actions@lessoneditor.iam",
  "database": "lessoneditor",
  "password": "ya29.c.KqYBGAgyR4D20qIMbqYVRipWGMUBSILWbfs2QpONHtguKDjLJJQqv_eSNWwcmSOr4rNnHHzkZLDuHJpdCubPPn0sJ6XxACJa20dqKr7Qjwb0ihMtS3HjQzFLBXhzU_VzhkhRCiv2GsHAW_WLwRYthKSLmg638bH2NWbThgJ0yCrbKB9K7yZe0RfdiPReNeWGEzqsgJw3UoFLvorPWiwN0eN9T_gjQBGEvA.....................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................",
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
