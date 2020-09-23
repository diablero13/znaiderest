# Frontend of Znaiderest widget

**Znaiderest** widget for distributing Znaiderest booking form on clients pages

## Testing

Test page: <https://embed.znaiderest.com/widget/index.html>

## Development

- `npm start` runs dev server and watcher
- `npm run build` creates production build

## Production deploy

- `npm run release` - runs a command to deploy new version of script/styles

- Production test page: <https://embed.znaiderest.com/widget/index.html>
- Production script: <https://embed.znaiderest.com/widget/index.js>
- Production styles: <https://embed.znaiderest.com/widget/styles.css>

## Integration of widget

```
<script src="https://embed.znaiderest.com/widget/index.js"></script>
<znaiderest-widget data-client-id="some-client-id"></znaiderest-widget>
```
