const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const clientPath = path.join(__dirname, '..', 'build');

console.log(clientPath)

app.use(express.static(clientPath));


app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
 });


 app.listen(port, () => {
   console.log(`Server is up on port ${port}!`);
});