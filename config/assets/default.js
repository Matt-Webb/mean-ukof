'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // 'public/lib/bootstrap/dist/css/bootstrap.css',
        // 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/ukof-theme/css/*.css'
      ],
      js: [
        'public/lib/ukof-theme/js/jquery.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        // 'public/lib/ukof-theme/js/jquery-2.1.0.min.js',
      	'public/lib/ukof-theme/js/bootstrap.min.js',
      	'public/lib/ukof-theme/js/shortcode-frontend.js',
      	'public/lib/ukof-theme/js/jquery.mixitup.js',
      	'public/lib/ukof-theme/js/classie.js',
      	'public/lib/ukof-theme/js/jquery.easing.1.3.js',
      	'public/lib/ukof-theme/js/waypoints.js',
      	'public/lib/ukof-theme/js/masterslider.min.js',
      	'public/lib/ukof-theme/js/banner.js',
      	// 'public/lib/ukof-theme/js/template.js',
      	'public/lib/ukof-theme/js/dropdown.js',
      	'public/lib/ukof-theme/js/theme.js',
      	'public/lib/ukof-theme/js/main.js',
        'public/lib/ukof-theme/js/maps.js',
        'public/lib/ukof-theme/js/map.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
