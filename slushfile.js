// load plugins
var gulp      = require('gulp'),
    inquirer  = require('inquirer'),
    del       = require('del'),
    iniparser = require('iniparser'),
    conflict  = require('gulp-conflict'),
    install   = require('gulp-install'),
    rename    = require('gulp-rename'),
    template  = require('gulp-template'),
    spawn     = require('child_process').spawn,
    gutil     = require('gulp-util');

var defaults = (function () {
  var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
      workingDirName = process.cwd().split('/').pop().split('\\').pop(),
      osUserName = homeDir && homeDir.split('/').pop() || 'root',
      configFile = homeDir + '/.gitconfig',
      user = {};

  if (require('fs').existsSync(configFile)) {
    user = iniparser.parseSync(configFile).user;
  } //end if
  return {
    appName    : workingDirName,
    userName   : user.name || osUserName,
    authorEmail: user.email || '',
    modules: {
      stylesPlugin: 'Nib'
    },
    source: {
      base           : 'src/'
    },
    output: {
      base   : 'dist/'
    }
  };
})();

// Limit the results down to the packages installed
var filterModuleNames = function (val) {
  return val.toLowerCase().replace(/\+(\w)/, function (match, $1) {
    return $1.toUpperCase();
  });
};

// Replace the paths with the specified paths the user gave
var filterPaths = function (val) {
  return val.replace(/(\w)([^\/])$/, '$1$2/');
};

// Replace the normal extension with the one the user gave
var filterExt = function (val) {
  return val.replace(/^([^\.])/, '.$1').replace(/\W+/g, '.');
};

// Does the user want to edit the source folder structure?
var sourceCustomizationWanted = function (answers) {
  return !!answers.sourceCustomization;
};

// Does the user want to edit the distribution folder structure?
var outputCustomizationWanted = function (answers) {
  return !!answers.outputCustomization;
};

// If they don't specify specifics, we need to have defaults ready
var handleDefaults = function (answers) {
  if (!answers.sourceCustomization) {
    answers.sourceBase = defaults.source.base;
  }
  if (!answers.outputCustomization) {
    answers.outputBase = defaults.output.base;
  }
  return answers;
};

// The default gulp task is ran when slush is executed
gulp.task('default', function (done) {
  inquirer.prompt([{
      name   : 'name',
      message: 'Give your app a name',
      default: defaults.appName
    }, {
      name   : 'appVersion',
      message: 'What is the version of your project?',
      default: '0.1.0'
    }, {
      name   : 'appDescription',
      message: 'What is a description of your project?',
      default: 'n/a'
    }, {
      name   : 'authorName',
      message: 'What is the author name?',
      default: defaults.userName
    }, {
      name   : 'authorEmail',
      message: 'What is the author email?',
      default: defaults.authorEmail
    }, {
      name   : 'userName',
      message: 'What is the github username?',
      default: defaults.userName
    }, {
      type   : 'confirm',
      name   : 'sourceCustomization',
      default: false,
      message: 'Would you like to customize source files folders?'
    }, {
      name   : 'sourceBase',
      message: 'The base folder of your source files:',
      when   : sourceCustomizationWanted,
      filter : filterPaths,
      default: defaults.source.base
    }, {
      type   : 'confirm',
      name   : 'outputCustomization',
      default: false,
      message: 'Would you like to customize output folders?'
    }, {
      name   : 'outputBase',
      message: 'The base folder of your output files:',
      when   : outputCustomizationWanted,
      filter : filterPaths,
      default: defaults.output.base
    }, {
      type   : 'confirm',
      name   : 'moveon',
      message: 'Continue?'
    }],
    function (answers) {
      var dirMap;
      
      if (!answers.moveon) return done();
      answers.file = { relative: '<%= file.relative %>' };
      answers = handleDefaults(answers);
      answers.year = (new Date()).getFullYear();
      dirMap = {
        'src'     : answers.sourceBase
      };
      gulp.src([
        __dirname + '/templates/app/**'
      ])
        .pipe(template(answers, {
          interpolate: /<%=\s([\s\S]+?)%>/g
        }))
        .pipe(rename(function (file) {
          if (file.basename[0] === '_' && file.basename[1] === '_'){
            file.basename = file.basename.slice(1);
          } else if (file.basename[0] === '_') {
            file.basename = '.' + file.basename.slice(1);
          } //end if
          if (answers.sourceCustomization) {
            file.dirname = file.dirname.replace(
              /^(src|views)\b|\/(scripts|styles|partials)\b/g,
              function (match, $1, $2) {
                return dirMap[$1 || $2] || $1 || $2;
              });
          } //end if
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('finish', function () {
          var a = answers,
              dirs = [];
              
          if (a.sourceCustomization) {
            a.sourceBase !== 'src/' && dirs.push('./src');
            a.sourceScripts !== 'scripts/' && dirs.push('./' + a.sourceBase + 'scripts');
            a.sourceStyles !== 'styles/' && dirs.push('./' + a.sourceBase + 'styles');
            a.sourceTemplates !== 'views/' && dirs.push('./views');
            a.sourcePartials !== 'partials/' && dirs.push('./' + a.sourceTemplates + 'partials');
            del(dirs, done);
          } else {
            del(dirs, done);
          } //end if
          // Run jspm install since install package doesn't run it
          var child = spawn('jspm', ['install'], {cwd: process.cwd()}),
              stdout = '',
              stderr = '';

          child.stdout.setEncoding('utf8');
          child.stdout.on('data', function(data){
            stdout += data;
            gutil.log(data);
          });
          child.stderr.setEncoding('utf8');
          child.stderr.on('data', function(data){
            stderr += data;
            gutil.log(gutil.colors.red(data));
          });
        });
    });
});
