/* jslint white: true, forin: true*/
/*jshint immed: true*/
/*global module, $, console*/
/*
 * mailman.js
 * version : 0.2
 * author : Takeshi Iwana
 * license : MIT
 * Code heavily borrwoed from Adam Draper
 */



(function () {
    'use strict';

    /************************************
        Helpers
    ************************************/
    //stackoverflow.com/a/17913898/1251031
    /*
     * @method extender
     * @param {Object} destination
     * @param {Object} source
     */
    Object.extender = function (destination, source) {
        var property;
        for (property in source) { // loop through the objects properties
            if (typeof source[property] === "object") { // if this is an object
                destination[property] = destination[property] || {};
                Object.extender(destination[property], source[property]); // recursively deep extend
            } else {
                destination[property] = source[property]; // otherwise just copy
            }
        }
        return destination;
    };

    /************************************
        Constants & Variables
    ************************************/

    var mailman,
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),
        VERSION = '0.2',
        MANDRILLURL = "https://mandrillapp.com/api/1.0/",
        MANDRILLCALLS = {
            users: MANDRILLURL + "users/",
            messages: MANDRILLURL + "messages/",
            tags: MANDRILLURL + "tags/",
            rejects: MANDRILLURL + "rejects/",
            whitelists: MANDRILLURL + "whitelists/",
            senders: MANDRILLURL + "Senders/",
            urls: MANDRILLURL + "urls/",
            templates: MANDRILLURL + "templates/",
            webhooks: MANDRILLURL + "webhooks/",
            subaccounts: MANDRILLURL + "subaccounts/",
            inbound: MANDRILLURL + "inbound/",
            exports: MANDRILLURL + "exports/",
            ips: MANDRILLURL + "ips/",
            metadata: MANDRILLURL + "metadata/"
        },
        MANDRILLAPI = {
            users: {
                info: {
                    url: MANDRILLCALLS.users + "info.json"
                },
                ping: {
                    url: MANDRILLCALLS.users + "ping.json"
                },
                ping2: {
                    url: MANDRILLCALLS.users + "ping2.json"
                },
                senders: {
                    url: MANDRILLCALLS.users + "senders.json"
                }
            },
            messages: {
                send: {
                    url: MANDRILLCALLS.messages + "send.json"
                },
                send_templates: {
                    url: MANDRILLCALLS.messages + "send-templates.json"
                },
                search: {
                    url: MANDRILLCALLS.messages + "search.json"
                },
                search_time_series: {
                    url: MANDRILLCALLS.messages + "search-time-series.json"
                },
                info: {
                    url: MANDRILLCALLS.messages + "info.json"
                },
                content: {
                    url: MANDRILLCALLS.messages + "content.json"
                },
                parse: {
                    url: MANDRILLCALLS.messages + "parse.json"
                },
                send_raw: {
                    url: MANDRILLCALLS.messages + "send-raw.json"
                },
                list_scheduled: {
                    url: MANDRILLCALLS.messages + "list-scheduled.json"
                },
                cancel_scheduled: {
                    url: MANDRILLCALLS.messages + "cancel-scheduled.json"
                },
                reschedule: {
                    url: MANDRILLCALLS.messages + "reschedule.json"
                }
            },
            tags: {
                list: {
                    url: MANDRILLCALLS.tags + "list.json"
                },
                'delete': {
                    url: MANDRILLCALLS.tags + "delete.json"
                },
                info: {
                    url: MANDRILLCALLS.tags + "info.json"
                },
                time_series: {
                    url: MANDRILLCALLS.tags + "time-series.json"
                },
                all_time_series: {
                    url: MANDRILLCALLS.tags + "all-time-series.json"
                }
            },
            reject: {
                add: {
                    url: MANDRILLCALLS.rejects + "add.json"
                },
                list: {
                    url: MANDRILLCALLS.rejects + "list.json"
                },
                'delete': {
                    url: MANDRILLCALLS.rejects + "delete.json"
                }
            },
            whitelists: {
                add: {
                    url: MANDRILLCALLS.whitelists + "add.json"
                },
                list: {
                    url: MANDRILLCALLS.whitelists + "list.json"
                },
                'delete': {
                    url: MANDRILLCALLS.whitelists + "delete.json"
                }
            },
            senders: {
                list: {
                    url: MANDRILLCALLS.senders + "list.json"
                },
                domains: {
                    url: MANDRILLCALLS.senders + "domains.json"
                },
                add_domain: {
                    url: MANDRILLCALLS.senders + "add-domain.json"
                },
                check_domain: {
                    url: MANDRILLCALLS.senders + "check-domain.json"
                },
                verify_domain: {
                    url: MANDRILLCALLS.senders + "verify-domain.json"
                },
                info: {
                    url: MANDRILLCALLS.senders + "info.json"
                },
                time_series: {
                    url: MANDRILLCALLS.senders + "time-series.json"
                }
            },
            urls: {
                list: {
                    url: MANDRILLCALLS.urls + "list.json"
                },
                search: {
                    url: MANDRILLCALLS.urls + "search.json"
                },
                time_series: {
                    url: MANDRILLCALLS.urls + "time-series.json"
                },
                tracking_domains: {
                    url: MANDRILLCALLS.urls + "tracking-domains.json"
                },
                add_tracking_domain: {
                    url: MANDRILLCALLS.urls + "add-tracking-domain.json"
                },
                check_tracking_domain: {
                    url: MANDRILLCALLS.urls + "check-tracking-domain.json"
                }
            },
            templates: {
                add: {
                    url: MANDRILLCALLS.templates + "add.json"
                },
                info: {
                    url: MANDRILLCALLS.templates + "info.json"
                },
                update: {
                    url: MANDRILLCALLS.templates + "update.json"
                },
                publish: {
                    url: MANDRILLCALLS.templates + "publish.json"
                },
                'delete': {
                    url: MANDRILLCALLS.templates + "delete.json"
                },
                list: {
                    url: MANDRILLCALLS.templates + "list.json"
                },
                time_series: {
                    url: MANDRILLCALLS.templates + "time-series.json"
                },
                render: {
                    url: MANDRILLCALLS.templates + "render.json"
                }
            },
            webhooks: {
                list: {
                    url: MANDRILLCALLS.webhooks + "list.json"
                },
                add: {
                    url: MANDRILLCALLS.webhooks + "add.json"
                },
                info: {
                    url: MANDRILLCALLS.webhooks + "info.json"
                },
                update: {
                    url: MANDRILLCALLS.webhooks + "update.json"
                },
                'delete': {
                    url: MANDRILLCALLS.webhooks + "delete.json"
                }
            },
            subaccounts: {
                list: {
                    url: MANDRILLCALLS.subaccounts + "list.json"
                },
                add: {
                    url: MANDRILLCALLS.subaccounts + "add.json"
                },
                info: {
                    url: MANDRILLCALLS.subaccounts + "info.json"
                },
                update: {
                    url: MANDRILLCALLS.subaccounts + "update.json"
                },
                'delete': {
                    url: MANDRILLCALLS.subaccounts + "delete.json"
                },
                pause: {
                    url: MANDRILLCALLS.subaccounts + "pause.json"
                },
                resume: {
                    url: MANDRILLCALLS.subaccounts + "resume.json"
                }
            },
            inbound: {
                domains: {
                    url: MANDRILLCALLS.inbound + "inbound.json"
                },
                add_domain: {
                    url: MANDRILLCALLS.inbound + "add-domain.json"
                },
                check_domain: {
                    url: MANDRILLCALLS.inbound + "check-domain.json"
                },
                delete_domain: {
                    url: MANDRILLCALLS.inbound + "delete-domain.json"
                },
                routes: {
                    url: MANDRILLCALLS.inbound + "routes.json"
                },
                add_route: {
                    url: MANDRILLCALLS.inbound + "add-route.json"
                },
                delete_route: {
                    url: MANDRILLCALLS.inbound + "delete-route.json"
                },
                send_raw: {
                    url: MANDRILLCALLS.inbound + "send-raw.json"
                }
            },
            exports: {
                info: {
                    url: MANDRILLCALLS.exports + "info.json"
                },
                list: {
                    url: MANDRILLCALLS.exports + "list.json"
                },
                rejects: {
                    url: MANDRILLCALLS.exports + "rejects.json"
                },
                whitelists: {
                    url: MANDRILLCALLS.exports + "whitelists.json"
                },
                activity: {
                    url: MANDRILLCALLS.exports + "activity.json"
                }
            },
            ips: {
                list: {
                    url: MANDRILLCALLS.ips + "list.json"
                },
                info: {
                    url: MANDRILLCALLS.ips + "info.json"
                },
                provision: {
                    url: MANDRILLCALLS.ips + "provision.json"
                },
                start_warmup: {
                    url: MANDRILLCALLS.ips + "start-warmup.json"
                },
                cancel_warmup: {
                    url: MANDRILLCALLS.ips + "cancel-warmup.json"
                },
                set_warmup: {
                    url: MANDRILLCALLS.ips + "set-warmup.json"
                },
                'delete': {
                    url: MANDRILLCALLS.ips + "delete.json"
                },
                list_pools: {
                    url: MANDRILLCALLS.ips + "list-pools.json"
                },
                pool_info: {
                    url: MANDRILLCALLS.ips + "pool-info.json"
                },
                create_pool: {
                    url: MANDRILLCALLS.ips + "create-pool.json"
                },
                delete_pool: {
                    url: MANDRILLCALLS.ips + "delete-pool.json"
                },
                check_custom_dns: {
                    url: MANDRILLCALLS.ips + "check-custom-dns.json"
                },
                set_custom_dns: {
                    url: MANDRILLCALLS.ips + "set-custom-dns.json"
                }

            },
            metadata: {
                list: {
                    url: MANDRILLCALLS.metadata + "list.json"
                },
                add: {
                    url: MANDRILLCALLS.metadata + "add.json"
                },
                update: {
                    url: MANDRILLCALLS.metadata + "update.json"
                },
                'delete': {
                    url: MANDRILLCALLS.metadata + "delete.json"
                }
            }

        },
        CONFIG = {
            type: 'POST',
            api: undefined,
            data: {
                'key': ''
            },
            debug: false
        };



    /************************************
        Constructors
    ************************************/

    // Mailman prototype object
    function Mailman(input) {
        CONFIG = Object.extender(CONFIG, input);
        mailman.debug(CONFIG, "Extended:");
        //store temp api
        var api = MANDRILLAPI;
        //http://stackoverflow.com/a/6906859/1251031
        function parse() {
            if (!input) {
                return undefined;
            }

            var prop, props = input.api.split('.');

            for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
                prop = props[i];

                var candidate = api[prop];
                if (candidate !== undefined) {
                    api = candidate;
                } else {
                    break;
                }

            }
            mailman.debug(api[props[i]], "Selected API:");
            CONFIG.api = api[props[i]];
        }
        parse();
        mailman.debug(CONFIG, "Configuration:");
    }

    /************************************
        Top Level Functions
    ************************************/

    mailman = function (input) {
        if (mailman.isMailman(input)) {
            input = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            input = 0;
        }

        return new Mailman(input);
    };

    // version number
    mailman.version = VERSION;

    // compare mailman object
    mailman.isMailman = function (obj) {
        return obj instanceof Mailman;
    };
    /*
     *@method debug
     *@param {Object} obj
     *@param {String} msg
     */
    mailman.debug = function (obj, msg) {
        if (CONFIG.debug === true) {
            if (msg) {
                console.log(msg);
            }
            console.log(obj);
        }
    };

    mailman.fn = Mailman.prototype = {

        clone: function () {
            return mailman(this);
        },
        request: function () {
            var sent = $.Deferred();
            
            mailman.debug(CONFIG.api, "type");
            $.ajax({
                type: CONFIG.type,
                url: CONFIG.api.url,
                data: CONFIG.data
            }).done(function (response) {
                mailman.debug(response, 'Response:');

                sent.resolve(response);
            });
            return sent.promise();
        }
    };

    /************************************
        Exposing Mailman
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = mailman;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `mailman` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.mailman = mailman;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return mailman;
        });
    }
}).call(this);