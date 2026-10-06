# tabishizhar9.github.io

My portfolio website: https://tabishizhar9.github.io

## How to update it

All text on the site lives in **`content.js`**. You never need to touch the other files.

- **Add a project:** copy one `{ ... }` block in `projects`, paste it after the last one, add a comma between them, change the text.
- **Add a paper:** put the PDF in the `papers/` folder, then add a block in `papers` with `pdf: "papers/your-file.pdf"`.
- **Update the CV:** replace `cv/Tabish_Izhar_CV.pdf` with the new PDF (same file name).
- **Hide a button:** set the link to `""`.

After changing a file on GitHub, the site updates by itself in 1–2 minutes.

## Files

| File | What it does |
|------|--------------|
| `content.js` | All the text and links (edit this) |
| `index.html` | Page structure |
| `style.css` | Colours and layout (colours are at the top) |
| `main.js` | Builds the page from `content.js` |
| `papers/` | Paper PDFs |
| `cv/` | CV PDF |
