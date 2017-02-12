## webpack file changer

### Motivation
 
 > We need to move files from any path to another path. We want to change something in the files. 
 This plugins provide change string in file after moving.


#### installitation

```ssh
npm install --save-dev webpack-file-changer
```

#### Usage 

##### options 

> options is used to move files or change files

Example : 

```javascript
    const fileChanger = new FileChanger(options);
```
##### options.move

> move is used to move files and change files if needed.

Example : 
```javascript
const fileChanger = new FileChanger({
    move: [{
        from: path.resolve(rootFolder, './assets', 'index.html'),
        to: './index.html',
        before: function(stats, move) {
            console.log("before moving");
        },
        after: function (stats, move) {
            console.log("after moved")
        }
    }]
});
```

##### options.change

> change is used to change content of files by given parameters.

```javascript
    const fileChanger = new FileChanger({
        change: [
          {
              file: "./index.html",
              parameters: {
                  'app\\.min\\.js': 'app.[renderedHash:0].min.js'
              }
          }  
        ]
    });
```

##### options.complete
* called after all changes.

##### options.move[].parameters || options.change[].parameters 
* used to replace content of file by the parameter[key, value];

##### options.move[].before || options.change[].before
* called before of the operation.

##### options.move[].after || options.change[].after
* called after of the operation.

#### Add Plugin to the webpack

- More informations about plugins [webpack-plugin](https://webpack.github.io/docs/plugins.html)

Example : 
```javascript
const fileChanger = new FileChanger(options);
webpackConfiguration.plugins.push(fileChanger);
```

#### Examples


* Move file and replace `hash` in once configuration

```javascript
const fileChanger = new FileChanger({
    move: [{
        from: path.resolve(rootFolder, './assets', 'index.html'),
        to: './index.html',
        parameters: {
            'app\\.min\\.js': 'app.[hash].min.js'
        },
        before: function(stats, move) {
            console.log("before moving");
        },
        after: function(stats, move) {
            console.log("after moved")
        }
    }],
    complete: function(stats) {
        console.log("on completed");
    }
});
```

* Move file after replace `hash` by configuration

```javascript
const fileChanger = new FileChanger({
     move: [{
         from: path.resolve(rootFolder, './assets', 'index.html'),
         to: './index.html',
         before: function(stats, move) {
             console.log("before moving");
         },
         after: function(stats, move) {
             console.log("after moved")
         }
     }],
     change: [
         {
             file: './index.html',
             parameters: {
                 'app\\.min\\.js': 'app.[hash].min.js'
             },
             before: function(stats, move) {
                 console.log("before replacing...");
             },
             after: function(stats, move) {
                 console.log("after replacing...");
             }
         }
     ],
     complete: function(stats) {
         console.log("on completed");
     }
});
```

* Move file and replace `renderedHash` in once configuration

```javascript
const fileChanger = new FileChanger({
    move: [{
        from: path.resolve(rootFolder, './assets', 'index.html'),
        to: './index.html',
        parameters: {
            'app\\.min\\.js': 'app.[renderedHash:0].min.js'
        },
        before: function(stats, move) {
            console.log("before moving");
        },
        after: function(stats, move) {
            console.log("after moved")
        }
    }],
    complete: function(stats) {
        console.log("on completed");
    }
});
```

* Move file after replace `renderedHash` by configuration

```javascript
const fileChanger = new FileChanger({
    move: [{
        from: path.resolve(rootFolder, './assets', 'index.html'),
        to: './index.html',
        before:function (stats, move) {
            console.log("before moving");
        },
        after:function (stats, move) {
            console.log("after moved")
        }
    }],
    change: [
      {
          file: "./index.html",
          parameters: {
              'app\\.min\\.js': 'app.[renderedHash:0].min.js'
          }
      }  
    ],
    complete: function (stats) {
        console.log("on completed");
    }
});
```


* Multi Chunks

```javascript
const fileChanger = new FileChanger({
    move: [{
        from: path.resolve(rootFolder, './assets', 'index.html'),
        to: './index.html',
        parameters: {
            "app\\.min\\.js": 'app.0.[hash].min.js',
            "app2\\.min\\.js": 'app2.0.[renderedHash:1].min.js'
        },
        before:function (stats, move) {
            console.log("before moving");
        },
        after:function (stats, move) {
            console.log("after moved")
        }
    }],
    complete: function() {
        console.log("on completed");
    }
});
```
