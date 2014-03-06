define(['jquery'
     // , 'lib/ECMA262-5'
     ], function() { //"use strict";

    var urlFragment = (function() {

        var RESOURCE_URI_DELIMITER = '/r';
        var MULTI_SELECT_ID_DELIMITER = '/m/';
        var PARAM_DELIMITER = '?';
        var HASH_DELIMITER = '#';
        var PAGE_PATTERN_TERMINAL = '(/.*|$)';
        var VIEW_PATTERN_TERMINAL = '($|/$|' +
                RESOURCE_URI_DELIMITER + '/|' +
                MULTI_SELECT_ID_DELIMITER + '|\\' +
                PARAM_DELIMITER + ')';
        var VIEW_MULTI_PATTERN_TERMINAL = '(' + 
                MULTI_SELECT_ID_DELIMITER + ')';
        var VIEW_SINGLE_PATTERN_TERMINAL = '($|/$|' +
                RESOURCE_URI_DELIMITER + '/)';

        /**
         * @constructor
         */
        function UrlFragment() {
            var self = this;
            
            this.pagePatternTerminal = PAGE_PATTERN_TERMINAL;
            this.viewPatternTerminal = VIEW_PATTERN_TERMINAL;
            this.viewMultiPatternTerminal = VIEW_MULTI_PATTERN_TERMINAL;
            this.viewSinglePatternTerminal = VIEW_SINGLE_PATTERN_TERMINAL;

            /**
             * Extracts the page element from the URL fragment.
             * @public
             * @param {string} fragment The URL fragment to extract from.
             */
            this.getPage = function (fragment) {
                var result = '', parts;
                if (fragment) {
                    // /(page)/view/sub-view/r/uri
                    parts = fragment.split(PARAM_DELIMITER)[0].
                        split(RESOURCE_URI_DELIMITER + '/')[0].
                        split(MULTI_SELECT_ID_DELIMITER)[0].split('/');
                    if (parts.length > 0) {
                        result = parts.slice(1, 2);
                    }
                }
                return result;
            };

            /**
             * Extracts the view element from the URL fragment.
             * @public
             * @param {string} fragment The URL fragment to extract from.
             */
            this.getView = function (fragment) {
                var result = '', parts;
                if (fragment) {
                    // /page/(view/sub-view)/r/uri
                    // /page/(view/sub-view)/m/id
                    // /page/(view/sub-view)?param=value
                    // /page/r/uri -> no view
                    // /page/m/id -> no view
                    // /page/?param=/abc -> no view
                    parts = fragment.split(PARAM_DELIMITER)[0].
                        split(RESOURCE_URI_DELIMITER + '/')[0].
                        split(MULTI_SELECT_ID_DELIMITER)[0].split('/');
                    if (parts.length > 2) {
                        result = parts.slice(2).join('/');
                    }
                }
                return result;
            };

            /**
             * Extracts the uris from the URL fragment.
             * @public
             * @param {string} fragment The URL fragment to extract from.
             */
            this.getUris = function (fragment) {
                var result = '';
                if (fragment) {
                    // /page/view/sub-view/r(/uri-1)/r(/uri-2)?param=value
                    // match on '/r/' and then add '/' back to front of uris
                    result = fragment.split(PARAM_DELIMITER, 1)[0]
                        .split(RESOURCE_URI_DELIMITER + '/').slice(1).map(
                            function (p) {
                                // TODO: Uri should not contain space. Made this change as
                                // a temporary fix for LUM team. Should remove this
                                // code asap.
                                return '/' + p.replace(/%20/g, ' ');
                            });
                }
                return result;
            };
            
            /**
             * Extracts the multi-select id from the URL fragment.
             * @public
             * @param {string} fragment The URL fragment to extract from.
             */
            this.getMultiSelectId = function (fragment) {
                var result = '';
                if (fragment) {
                    // /page/view/sub-view/m/(id)?param=value
                    // match on '/m/'
                    result = fragment.split(PARAM_DELIMITER, 1)[0]
                        .split(MULTI_SELECT_ID_DELIMITER).slice(1)[0];
                }
                return result;
            };

            /**
             * Returns the list of parameters from a fragment.
             * Be extremely careful not to put these parameters into HTML literally somehow using $.html() or similar.
             * Instead use $.text() or $.val() so they get properly encoded. They may have come from a malicious user
             * and could be an XSS attack.
             */
            function getParameterList(fragment) {
                var paramsIndex, hashIndex, paramString,
                    paramsList = [];
                if (fragment) {
                    paramsIndex = fragment.indexOf(PARAM_DELIMITER);
                    hashIndex = fragment.indexOf(HASH_DELIMITER);

                    /*
                     * We check for an unescaped hashtag after the query to avoid
                     * parsing anything beyond it.
                     */
                    if (paramsIndex >= 0) {
                        if (hashIndex > paramsIndex) {
                            paramString = fragment.slice(paramsIndex + 1, hashIndex);
                        } else {
                            paramString = fragment.slice(paramsIndex + 1);
                        }
                        paramsList = paramString.split('&');
                    }
                }
                return paramsList;
            }

            /**
             * Returns a map of parameter values from a fragment keyed by name.
             * Be extremely careful not to put these parameters into HTML literally somehow using $.html() or similar.
             * Instead use $.text() or $.val() so they get properly encoded. They may have come from a malicious user
             * and could be an XSS attack.
             */
            this.getParameters = function (fragment) {
                var vars = {},
                    param,
                    paramList = getParameterList(fragment);

                for(var i = 0; i < paramList.length; i++) {
                    param = paramList[i].split('=');
                    var name = decodeURIComponent(param[0]);
                    var value = decodeURIComponent(param[1]);
                    if (name.slice(-2) === '[]') {
                        // array
                        name = name.slice(0, -2);
                        if (! vars[name]) {
                            vars[name] = [];
                        }
                        vars[name].push(value);
                    } else {
                        vars[name] = value;
                    }
                }
                return vars;
            };
            
            this.hasParameters = function (fragment) {
                return (fragment && fragment.indexOf(PARAM_DELIMITER) > 0);
            };

            /**
             * Replaces the view element in the URL fragment.
             * @public
             * @param {string} fragment The URL fragment to replace in.
             * @param {string} view The new view element to replace with.
             */
            this.replaceView = function (fragment, view) {
                return self.createFragment(self.getPage(fragment),
                    view, self.getUris(fragment), self.getMultiSelectId(fragment),
                    getParameterList(fragment));
            };

            /**
             * Resets the view element in the URL fragment.
             * Any resource URIs are removed.
             * @public
             * @param {string} fragment The URL fragment to reset in.
             * @param {string} view The new view element to reset with.
             */
            this.resetView = function (fragment, view) {
                return self.createFragment(self.getPage(fragment), view, [], null);
            };

            /**
             * Replaces the view element and resource URIS in the URL fragment.
             * @public
             * @param {string} fragment The URL fragment to replace in.
             * @param {string} view The new view element to replace with.
             * @param {Array} uris The new uris to replace with.
             */
            this.resetViewAndUris = function (fragment, view, uris) {
                return self.createFragment(self.getPage(fragment), view, uris, null);
            };
            
            this.stripToView = function (fragment) {
                return self.createFragment(self.getPage(fragment), self.getView(fragment));
            };

            /**
             * Replaces the resource URIS in the URL fragment.
             * @public
             * @param {string} fragment The URL fragment to replace in.
             * @param {Array} uris The new uris to replace with.
             */
            this.replaceUris = function (fragment, uris, multiSelectId) {
                return self.createFragment(self.getPage(fragment),
                    self.getView(fragment), uris, multiSelectId,
                    getParameterList(fragment));
            };
            
            /**
             * Replaces the parameters in the URL fragment.
             * @public
             * @param {string} fragment The URL fragment to replace in.
             * @param {Array} parameters The new parameters to replace with.
             *        If parameters is a string, parameter names and values
             *        should already be encoded via encodeURIComponent.
             */
            this.replaceParameters = function (fragment, parameters) {
                // convert name -> value object to 'name=value' array, if needed
                if ('array' !== $.type(parameters)) {
                    var converted = [];
                    $.each(parameters, function (name, value) {
                        if ($.isArray(value)) {
                            $.each(value, function (index, val) {
                                converted.push(encodeURIComponent(name + '[]') + '=' +
                                    encodeURIComponent(val));
                            });
                        } else {
                            converted.push(encodeURIComponent(name) + '=' +
                                encodeURIComponent(value));
                        }
                    });
                    parameters = converted;
                }
                return self.createFragment(self.getPage(fragment),
                    self.getView(fragment), self.getUris(fragment),
                    self.getMultiSelectId(fragment), parameters);
            };

            /**
             * Creates a new URL fragment.
             * @public
             * @param {string} page The page.
             * @param {string} view The view element.
             * @param {Array} uris The uris.
             * @param {string} multiSelectId The multi-select id.
             * @param {Array} params The parameters (name=value)
             *        parameter values should already be encoded via encodeURIComponent
             */
            this.createFragment = function (page, view, uris, multiSelectId, params) {
                // strip leading '/' from page
                var result = '/' + (page[0] === '/' ? page.slice(1) : page);
                if (view) {
                    result += '/' + view;
                }
                if (multiSelectId) {
                    result += MULTI_SELECT_ID_DELIMITER + multiSelectId;
                } else if (uris && uris.length > 0) {
                    result += RESOURCE_URI_DELIMITER +
                        uris.join(RESOURCE_URI_DELIMITER);
                }
                if (params && params.length > 0) {
                    result += PARAM_DELIMITER + params.join('&');
                }
                return result;
            };

            /**
             * Replace the URIS in any  anchor hrefs within ROOT.
             * @public
             * @param {string} ROOT The context to look for anchors in.
             * @param {Array} uris The new uris to replace with.
             * @param {string} multiSelectId The multi-select id (optional).
             */
            this.replaceHrefUris = function (ROOT, uris, multiSelectId) {
                
            };

            function replaceHrefParameters(elem, parameters) {
                var location = $(elem).attr('href');
                if (location) {
                    $(elem).attr('href', location.split('?')[0] +
                        (parameters ? '?' + parameters : ''));
                }
            }

            this.replaceHrefParametersFromFragment = function (context, fragment) {
              
            };
            
            // Decode a string that has been "html entities" encoded so that it can be displayed properly
            // Caution - do not ever use a decoded string as an ID for html, as it can be exploited 
            // for an XSS attack
            this.decodeHtmlEntities = function (str) {
                var encoderDiv = $('<div/>');
                return str ? encoderDiv.html(str).text() : str ;
            };
        }

        return new UrlFragment();
    }());

    return urlFragment;
});
