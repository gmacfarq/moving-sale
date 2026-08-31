# Item photos

Put item photos in this folder, then reference them from the `images:` field
of the matching item in `index.html`.

## Naming

Use the item's code plus a number, e.g. for item `ELX-01`:

```
images/ELX-01-1.jpg
images/ELX-01-2.jpg
images/ELX-01-3.jpg
```

Then in `index.html`:

```js
{ code: 'ELX-01', category: 'Electronics', name: '...', price: 60, status: 'available',
  images: ['images/ELX-01-1.jpg', 'images/ELX-01-2.jpg', 'images/ELX-01-3.jpg'] }
```

An item with no `images` field just shows as a plain (non-clickable) row.

## Before committing photos — resize them

Phone photos are often 3–5 MB each, which bloats the repo. Aim for ~1200 px
wide and under ~300 KB. On a Mac you can batch-resize with:

```bash
sips -Z 1200 images/*.jpg
```

(ImageMagick: `mogrify -resize 1200x1200\> -quality 82 images/*.jpg`)

## Remote images

An item's `images` entry can also be a full URL instead of a local file. The
book covers currently on the site are hotlinked from openlibrary.org, e.g.
`https://covers.openlibrary.org/b/id/8805168-L.jpg` — nothing is stored here for
those.
