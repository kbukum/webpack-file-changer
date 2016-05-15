var fs = require("fs-extra");

function ChangerPlugin(options) {
  // Setup the plugin instance with options..
  this.options = options;
}

var replaceInFile = function (filePath, toReplace, replacement) {
  var replacer = function (match) {
    console.log('Replacing in %s: %s => %s', filePath, match, replacement);
    return replacement
  };
  var str = fs.readFileSync(filePath, 'utf8');
  var out = str.replace(new RegExp(toReplace, 'g'), replacer);
  fs.writeFileSync(filePath, out);
};

function checkAndChangeParameters(stats,options){
  var hash = stats.hash;
  if(options.change && options.change.length > 0 ){
    for(var i = 0 ;i < options.change.length; i++){

      var changeFilePath = options.change[i];
      for (var key in changeFilePath.parameters) {

        var value = changeFilePath.parameters[key];
        if(value == null ){
          value = "";
        }
        if(typeof value === "string"){
          if(value.indexOf("[hash]") != -1){
            value =  value.replace("[hash]",hash);
          }
        }
        replaceInFile(
            changeFilePath.file,
            key,
            value
        );
      }
    }
  }
}

ChangerPlugin.prototype.apply = function(compiler) {
  var options = this.options;
  compiler.plugin('done', function(stats) {
    var  j = 0 ;

    if(options.move && options.move.length > 0 ){
      for(var i = 0 ;i < options.move.length; i++){
        var movePath = options.move[i];
        fs.copy(movePath.from,movePath.to, function (err) {
          j++;
          if (err) return console.error("copy static files error ! Detail : " + err);
          console.log("copied static files from the " +movePath.from +" folder to " +movePath.to+ " folder !")
          if(j == options.move.length){
            checkAndChangeParameters(stats,options);
          }
        });
      }
    }else{
      checkAndChangeParameters(stats,options);
    }
  });

};

module.exports = ChangerPlugin;