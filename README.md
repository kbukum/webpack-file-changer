## webpack-file-changer

### Motivation
 
 We need to move files from any path to another path. We want to change something in the files. 
 This plugins provide change string in file after moving.


#### installitation

```ssh
npm install webpack-file-changer
```

#### usage 

```javascript
var FileChanger = require('webpack-file-changer')

var fileChanger = new FileChanger({
    move :[{
            from: /Users/kbukum/sourcePath,
            to : /Users/kbukum/destinationPath
        }
    ],
    change : [{
            file: /Users/kbukum/destinationPath/myFile.txt,
            parameters : {
                "old word":"new word"
            }
        }
    ]
})
```