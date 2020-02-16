const fs = require('fs');

fs.readFile('docs/index.html', 'utf8', (err, data) => {
  const newData = data.replace(/="\/static/gim, '="/streaming-no-ts-client-web/static');
  fs.writeFile('docs/index.html', newData, console.error);
});