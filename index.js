var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-callback';

// options:
// - `once` (boolean) : invoke the `transformFunction` only once at the start.
// 
// Note:
// 
// The `callback` function passed to `transformFunction(chunk, encoding, callback)` as an argument
// extends the regular `through2` interface for this by offering a third argument `doNotCopy` (boolean)
// which the userland code may use to signal that the default `gulp-callback` action (copying the
// processed chunk verbatim) is to be skipped.
module.exports = function (transformFunction, flushFunction, options) {
    // `transformFunction` is optional
    if (typeof transformFunction !== 'function' && transformFunction) {
        throw new PluginError(PLUGIN_NAME, 'transformFunction callback is not a function');
    }
    // `flushFunction` is optional
    if (typeof flushFunction !== 'function' && flushFunction) {
        if (!options && typeof flushFunction === 'object') {
            options = flushFunction;
            flushFunction = null;
        } else if (options) {
            throw new PluginError(PLUGIN_NAME, 'flushFunction callback is not a function');
        }
    }
    // yet at least either of the callbacks MUST have been specified
    if (!transformFunction && !flushFunction) {
        throw new PluginError(PLUGIN_NAME, 'You have specified neither a valid transformFunction callback function nor a valid flushFunction callback function');
    }
    // `options` is optional
    if (options && typeof options !== 'object') {
        throw new PluginError(PLUGIN_NAME, 'options is not an options object');
    }

    options = options || {};
    var once = false;
    var streamOptions = options.streamOptions = options.streamOptions || {
        // See for what's inside here: https://github.com/rvagg/through2#api
        objectMode: true
    };

    return through(streamOptions, function (file, enc, cb) {
        // Pass file through if:
        // - file has no contents
        // - file is a directory
        if (file.isNull() || file.isDirectory()) {
            this.push(file);
            return cb();
        }

        // we dont do streams (yet)
        if (file.isStream()) {
          return this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }

        // This extends the `callback` function interface compared to
        // https://github.com/rvagg/through2#transformfunction
        // 
        // See also the note further above where this gulp plugin's options
        // are described.
        var callback = function (err, chunk, doNotCopy) {
            once = options.once;

            if (!err && !chunk) {
                if (doNotCopy) {
                    cb();
                } else {
                    cb(null, file);
                }
            } else {
                cb(err, chunk);
            }
        };

        if (!once && transformFunction) {
            return transformFunction.call(this, file, enc, callback, {
                options: options
            });
        } else {
            cb();
        }
    }, function (cb) {
        if (flushFunction) {
            return flushFunction.call(this, cb, {
                options: options
            });
        } else {
            cb();
        }
    });
};
