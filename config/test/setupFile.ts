const jasmineReporters = require('jasmine-reporters');
// Some of the `jest-runtime` tests are very slow and cause
// timeouts on travis
(jasmine as any).DEFAULT_TIMEOUT_INTERVAL = 5000;

if (process.env.APPVEYOR_API_URL) {
    // Running on AppVeyor, add the custom reporter.
    (jasmine as any).getEnv().addReporter(new jasmineReporters.AppVeyorReporter());
}
let glob = (global as any);
let jestIt = glob.it;
const functionPattern = /(function( [a-zA-Z_$][a-zA-Z_$0-9]*)?)[ ]*\((.*)\).*/;

glob.it = (name: string, callback) => {
    if(!callback) {
        throw new Error("It function is not defined ! ");
    }
    let functionString = callback.toString();
    let results = functionString.match(functionPattern);

    if(!results || results.length !== 4) {
        throw new Error("Given parameter as function to 'it' is not a function ! ");
    }
    let doneString = results[4];

    if(!doneString || doneString.trim() === "") {
      jestIt(name, callback);
    } else {
        jestIt(name, async () => {
            let prom = new Promise((resolve: Function, reject: Function) => {
                callback((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            await prom.then(() => {
                console.log(`${name} done.`);
            }).catch((e) => {
                throw e;
            });
        });
    }
};

