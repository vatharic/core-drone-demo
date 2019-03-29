# core-drone-demo
Web app drone demo

# Developing
### Install dependencies:
```
npm install
```

### Start dev server and watcher
```
npm start           // start dev server with rollup -c --watch
```

### Test
__coming soon__
```
npm run test        // runs tests with afterwork `aw chrome -c ./test/aw.config.js`
npm run test:watch  // runs & watch tests `aw chrome -c ./test/aw.config.js -w`
```

### Lint
```
npm run lint        // runs linting on javascript and styles `eslint .`
npm run lint:fix    // runs linting and make fixes on javascript and styles `eslint . --fix`
```

### Build
```
npm run build       // will build the app `rollup -c` with env=production
```
