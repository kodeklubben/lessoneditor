# Editing a published lesson

A "Rediger oppgave" button on oppgaver.kidsakoder.no opens a lesson in the editor. The teacher edits their own copy; submitting opens a pull request on `kodeklubben/oppgaver` with only the texts they changed.

The work is done in three pull requests:

| PR | What | Writes to GitHub |
|---|---|---|
| A | Import: `/rediger/<course>/<lesson>` makes a copy for the signed-in user | No |
| B | Submitting an imported lesson: a pull request with only the changed files, nothing deleted | Yes (tested against `sagatun/oppgaver-test`) |
| C | The button on oppgaver.kidsakoder.no | No (another repo) |

## What a lesson in the repo looks like

Survey of `kodeklubben/oppgaver` (`master`, 22 Nov 2026): 15 courses, 335 lesson folders under `src/<course>/<lesson>/`.

- Texts: `<base>.md` (bokmål), `<base>_<language>.md` (nn 241, ua 43, en 17, is 3). Teacher guides `README.md`, `README_nn.md`.
- `<base>` differs from the folder name in 206 files (`appinventor/PaintPot_part1/PaintPot1.md`). 41 folders have upper case letters.
- `lesson.yml`: `level` and `tags` (`topic`, `subject`, `grade`, the same keys the editor uses).
- Front matter: `title`, `author`, `translator`, `language`, often `level`, sometimes more.
- Next to the texts: about 1100 images, and `.py`, `.html`, `.js`, `.zip`, `.sb2`, `.pdf`, sound and video; 18 lessons have subfolders.
- 15 folders (4 %) have texts with more than one base name (`python_buttons.md` in English and `python_buttons_nb.md`). They do not follow the language convention.

## Import (PR A)

`POST /api/lesson/import` with `{ course, lesson }`, called by the page `/rediger/<course>/<lesson>`:

1. The folder is read from the repo's default branch with the user's GitHub token (the API allows 60 requests an hour without one, shared by everyone on App Engine).
2. Lessons the editor cannot handle yet are refused with a message, not guessed at: no `lesson.yml`, or texts with more than one base name.
3. Copied into a new lesson owned by the user: the texts (`.md`), `lesson.yml` and the images in the folder itself. Other files (code, archives, subfolders) are not copied; the editor does not edit them, and the submission never touches them.
4. The lesson remembers where it came from: `upstream_path` (`src/<course>/<lesson>`) and `upstream_commit`. Each copied file remembers the repo's blob sha (`upstream_sha`) and the sha of what was stored (`imported_sha`).
5. `lessonSlug` is the texts' base name (`PaintPot1`), so the editor's file names work unchanged. The folder name is kept in `upstream_path`.
6. If the user already has an unsubmitted copy of the same lesson, that one is opened instead of a second copy.

Texts are stored the way the editor reads them: front matter lists (`authorList`, `translatorList`); fields the editor does not know (`level` and others) are kept. `lesson.yml` is stored as the editor's JSON.

What "no changes" means: a file is changed when the sha of its stored content differs from `imported_sha`. Opening a text and closing it again changes nothing.

## Submitting (PR B)

- Only files whose content differs from `imported_sha`, plus files added in the editor (new images, new languages), go into the commit. Nothing is deleted.
- Changed texts are written back with the repo's front matter. Fields the editor does not know (`level` and others) stay in place.
- Written to `upstream_path`, on the branch `<lessonId>` from the repo's current default branch. The pull request is titled "Endringer i <title>".
- Before anything is written, the repo's folder is compared with `upstream_sha`. If someone else changed one of the files meanwhile, the submission is refused with the file names (409); the teacher makes a new copy. A copy without changes is refused too (400).
- The submitter works through their fork, as for new lessons. Whoever owns the lesson repo (such as a test copy under their own account) works in it directly.
- Submitting again updates the same branch and pull request.
- Later: lock the copy after its pull request is merged, so editing again starts from a fresh import.

## Languages

`ua` (Ukrainian, as the repo names it) is added to the editor's languages. A file's language is the suffix after the last `_` only when it is a known language code, so `lunar_lander.md` is bokmål, not "lander".
