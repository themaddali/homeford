// This is the first JS file that will be loaded to take care of all the library loadings

require({
    baseUrl : './',
    paths : {
        //If you changed something here, you should change it in src/main/build/app.build.js
        //as well as src/test/js/require-base.js
        //and consider if changes need to be made to src/tour/js/tour/tour-require.js
        text : 'js/lib/text',
        jquery : 'js/lib/jquery-1.7.1',
        jqueryUI : 'js/lib/jquery-ui-1.8.16.piano.min',
        modernizr : 'js/lib/modernizr-2.0.6',
        example : 'js/example',
        lang : 'js/xsys/lang',
        xsys : 'js/xsys',
        lib : 'js/lib',
        hpPages : 'pages',
        fsPages : 'pages/fs',
        xsysPages : 'pages/xsys',
        hp : 'js/hp',
        fs: 'js/fs',
        'hp/services/SessionService' : 'js/xsys/xSysSessionService',
        'hp/services/authn' : 'js/xsys/xSysAuthn',
        'hp/services/authz' : 'js/xsys/xSysAuthz',
        'hp/services/IndexService' : 'js/xsys/services/ComplianceService',
        'hpPages/core/help_menu' : 'pages/xsys/help_menu'
    },
    priority : ['modernizr', 'jquery'],
    waitSeconds : 20 // make VPN more resilient
}, ['hp/Application', 'xsys/shell/MainPageRoutes','hp/model/DevelopmentSettings',
    'jquery', 'jqueryUI', 'modernizr', 'lib/json2'],
     function(application, routes, developmentSettings) { "use strict";

    $.ajaxSetup({
        // Disable caching of AJAX responses for development
        cache : false
    });

    $(document).ready(function() {

        application.init("HP  App Insight");
        developmentSettings.save({refreshInterval : 1000000 , maxIndexItems : 10000, experimentalFeatures : false , routingLogLevel : 0 , disableAudio : false});
        routes.load();
        application.start();
    });
});
