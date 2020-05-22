const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
          'Components': path.resolve(__dirname, '/components')
        }      
    }
}