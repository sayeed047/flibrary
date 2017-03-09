"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('flibrary/adapters/application', ['exports', 'emberfire/adapters/firebase'], function (exports, _emberfireAdaptersFirebase) {
  exports['default'] = _emberfireAdaptersFirebase['default'].extend({});
});
define('flibrary/app', ['exports', 'ember', 'flibrary/resolver', 'ember-load-initializers', 'flibrary/config/environment'], function (exports, _ember, _flibraryResolver, _emberLoadInitializers, _flibraryConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _flibraryConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _flibraryConfigEnvironment['default'].podModulePrefix,
    Resolver: _flibraryResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _flibraryConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('flibrary/components/about-component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('flibrary/components/contact-component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    message: '',
    email: '',
    store: _ember['default'].inject.service(),

    isEmailValid: _ember['default'].computed('email', function () {
      var e = this.get('email');
      var atpos = e.indexOf("@");
      var dotpos = e.lastIndexOf(".");
      if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= e.length) {
        return false;
      } else {
        return true;
      }
    }),

    isValid: _ember['default'].computed('isEmailValid', 'isMessageEnoughLong', function () {
      if (this.get('isEmailValid') && this.get('isMessageEnoughLong')) {
        return false;
      } else {
        return true;
      }
    }),

    getMessage: _ember['default'].computed('message', function () {
      return this.get('message');
    }),

    getEmail: _ember['default'].computed('message', function () {
      return this.get('email');
    }),

    isMessageEnoughLong: _ember['default'].computed('message', function () {
      console.log("changing");
      if (this.get('message').length > 5) {
        return true;
      } else {
        return false;
      }
    }),

    actions: {
      sucess: function sucess() {
        var _this = this;

        this.get('store').createRecord('contact', { email: this.get('getEmail'), message: this.get('getMessage') }).save().then(function () {
          _this.set('sucessMessage', "Thank you! Your message is sent.");
        });
      }, again: function again() {
        this.set('sucessMessage', '');
        this.set('message', '');
        this.set('email', '');
      }
    }
  });
});
define("flibrary/components/editbook-component", ["exports", "ember"], function (exports, _ember) {
  exports["default"] = _ember["default"].Component.extend({
    store: _ember["default"].inject.service(),
    tempBook: {
      title: "",
      author: "",
      year: ""
    },
    getTempBook: _ember["default"].computed('tempBook', function () {
      return this.get('tempBook');
    }),
    actions: {
      deleteBook: function deleteBook(book) {
        var books = this.get('library.book');
        var index = books.indexOf(book);
        if (index === 0) {
          alert("Request Denied! Not allowed to  delete all books");
          this.get('router').transitionTo('libraries.edit.index');
        } else {
          books.splice(index, 1);
          this.get('library').set('book', books);
          this.get('library').save().then(function () {
            console.log("succesfully added");
            //this.get('router').transitionTo('libraries.edit.index');
          });
        }
        //console.log("the index is "+ id);
        //books[id].remove();
        //console.log(books);
      },
      saveLibrary: function saveLibrary() {
        var _this = this;

        if (this.get('library.book').length === 1) {
          var book = this.get('library').get('book')[0];
          if (book.title === "empty") {
            console.log("empty one");
            this.get('library').set('book', [this.get('getTempBook')]);
            this.get('library').save().then(function () {
              console.log("succesfully added");
              _this.get('router').transitionTo('libraries.edit.index');
            });
          } else {
            var books = this.get('library.book');
            books.push(this.get('tempBook'));
            console.log(books);
            this.get('library').set('book', books);
            this.get('library').save().then(function () {
              console.log("succesfully added");
              _this.get('router').transitionTo('libraries.edit.index');
            });
          }
        } else {
          var books = this.get('library.book');
          books.push(this.get('tempBook'));
          console.log(books);
          this.get('library').set('book', books);
          this.get('library').save().then(function () {
            console.log("succesfully added");
            _this.get('router').transitionTo('libraries.edit.index');
          });
        }
      }
    }
  });
});
define('flibrary/components/index-component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    emailAddress: '',

    isValid: _ember['default'].computed.match('emailAddress', /^.+@.+\..+$/),
    isDisabled: _ember['default'].computed.not('isValid'),
    store: _ember['default'].inject.service(),

    actualEmailAddress: _ember['default'].computed('emailAddress', function () {
      console.log(this.get('emailAddress'));
      return this.get('emailAddress');
    }),

    actions: {

      saveInvitation: function saveInvitation() {
        var _this = this;

        var email = this.get('emailAddress');

        var newInvitation = this.get('store').createRecord('invitation', {
          email: email
        });

        newInvitation.save().then(function (response) {
          _this.set('responseMessage', 'Thank you! We saved your email address with the following id: ' + response.get('id'));
          _this.set('emailAddress', '');
        });
      }, againn: function againn() {
        this.set("responseMessage", '');
      }
    }

  });
});
define('flibrary/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _emberWelcomePageComponentsWelcomePage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWelcomePageComponentsWelcomePage['default'];
    }
  });
});
define('flibrary/helpers/app-version', ['exports', 'ember', 'flibrary/config/environment'], function (exports, _ember, _flibraryConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _flibraryConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('flibrary/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('flibrary/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('flibrary/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'flibrary/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _flibraryConfigEnvironment) {
  var _config$APP = _flibraryConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('flibrary/initializers/component-router-injector', ['exports'], function (exports) {
  exports.initialize = initialize;

  function initialize(application) {
    // Injects all Ember components with a router object:
    application.inject('component', 'router', 'router:main');
  }

  exports['default'] = {
    name: 'component-router-injector',
    initialize: initialize
  };
});
define('flibrary/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('flibrary/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('flibrary/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('flibrary/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, _emberfireInitializersEmberfire) {
  exports['default'] = _emberfireInitializersEmberfire['default'];
});
define('flibrary/initializers/export-application-global', ['exports', 'ember', 'flibrary/config/environment'], function (exports, _ember, _flibraryConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_flibraryConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _flibraryConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_flibraryConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('flibrary/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('flibrary/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('flibrary/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("flibrary/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('flibrary/models/contact', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    email: _emberData['default'].attr('string'),
    message: _emberData['default'].attr('string')
  });
});
define('flibrary/models/invitation', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    email: _emberData['default'].attr('string')
  });
});
define('flibrary/models/library', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    address: _emberData['default'].attr('string'),
    phone: _emberData['default'].attr('string'),
    book: _emberData['default'].attr()
  });
});
define('flibrary/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('flibrary/router', ['exports', 'ember', 'flibrary/config/environment'], function (exports, _ember, _flibraryConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _flibraryConfigEnvironment['default'].locationType,
    rootURL: _flibraryConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('about');
    this.route('contact');

    this.route('admin', function () {
      this.route('invitations');
      this.route('feedbacks');
    });

    this.route('libraries', function () {
      this.route('new');
      this.route('edit', { path: '/:library_id/edit' }, function () {
        this.route('editbook', { path: '/editbook' });
      });
    });
  });

  exports['default'] = Router;
});
define('flibrary/routes/about', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    actions: {
      add: function add() {

        this.get('store').createRecord('library', {
          name: "HITech Library",
          address: "some address and adress",
          phone: "+91 1234567780",
          book: [{
            title: "C programming",
            author: "Denis Richie",
            year: "2016"
          }]
        }).save().then(function () {
          console.log("succesfully added");
        });
      }
    }

  });

  /*
  {name:"Hitech Libray",address:"temp some address",phone:"+91 1234554321",book:books}).save().then(()=>{
    console.log("succesfully added");
  });
  });
  }*/
});
define('flibrary/routes/admin/feedbacks', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').findAll('contact');
    },
    actions: {

      'delete': function _delete(record) {
        record.destroyRecord();
      }
    }
  });
});
define('flibrary/routes/admin/invitations', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').findAll('invitation');
    },
    actions: {
      'delete': function _delete(record) {
        record.destroyRecord();
      }
    }
  });
});
define('flibrary/routes/contact', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('flibrary/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('flibrary/routes/libraries/edit', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model(params) {
      return this.store.findRecord('library', params.library_id);
    },

    actions: {

      saveLibrary: function saveLibrary(newLibrary) {
        var _this = this;

        newLibrary.save().then(function () {
          return _this.transitionTo('libraries');
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");
          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});
define('flibrary/routes/libraries/edit/editbook', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    /*model(params) {
      return this.store.findRecord('library', params.library_id);
    }*/
  });
});
define('flibrary/routes/libraries/edit/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('flibrary/routes/libraries/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.get('store').findAll('library');
    },
    actions: {

      deleteLibrary: function deleteLibrary(library) {
        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          library.destroyRecord();
        }
      }
    }

  });
});
define('flibrary/routes/libraries/new', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.createRecord('library');
    },

    actions: {

      saveLibrary: function saveLibrary(newLibrary) {
        var _this = this;

        newLibrary.set('book', [{ title: "empty", author: "empty", year: "empty" }]);

        newLibrary.save().then(function () {
          return _this.transitionTo('libraries');
        });
      },

      willTransition: function willTransition() {
        // rollbackAttributes() removes the record from the store
        // if the model 'isNew'
        this.controller.get('model').rollbackAttributes();
      }
    }
  });

  /*
  willTransition() {
    let model = this.controller.get('model');
  
    if (model.get('isNew')) {
      model.destroyRecord();
    }
  }
  */
});
define('flibrary/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('flibrary/services/firebase-app', ['exports', 'emberfire/services/firebase-app'], function (exports, _emberfireServicesFirebaseApp) {
  exports['default'] = _emberfireServicesFirebaseApp['default'];
});
define('flibrary/services/firebase', ['exports', 'emberfire/services/firebase'], function (exports, _emberfireServicesFirebase) {
  exports['default'] = _emberfireServicesFirebase['default'];
});
define("flibrary/templates/about", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "qTjJpzbi", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"about-component\"]],false],[\"text\",\"\\n\\n\"],[\"comment\",\"<button  {{action 'add'}} class=\\\"btn btn-default\\\" >Add Temp libraries</button>\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/about.hbs" } });
});
define("flibrary/templates/admin/feedbacks", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "NJCMIq5p", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"Customer feedbacks\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-bordered table-striped\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"ID\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"E-mail\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"Message\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,0],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"feedbacks\",\"id\"]],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"feedbacks\",\"email\"]],false],[\"close-element\"],[\"text\",\"\\n\\n          \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-fluid\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-10\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"unknown\",[\"feedbacks\",\"message\"]],false],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-2 text-right\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-xs btn-danger text-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\",[\"get\",[\"feedbacks\"]]]],[\"flush-element\"],[\"text\",\"delete\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\\n              \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"feedbacks\"]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/admin/feedbacks.hbs" } });
});
define("flibrary/templates/admin/invitations", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "NoRFi9lv", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"Subscribers\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-bordered table-striped\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"ID\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"E-mail\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,0],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"Subscribers\",\"id\"]],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"classs\",\"container-fluid\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-8\"],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"append\",[\"unknown\",[\"Subscribers\",\"email\"]],false],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-4 text-right\"],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger btn-xs text-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\",[\"get\",[\"Subscribers\"]]]],[\"flush-element\"],[\"text\",\"delete\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"Subscribers\"]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/admin/invitations.hbs" } });
});
define("flibrary/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "BeSO8vzz", "block": "{\"statements\":[[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"navbar navbar-default navbar-fixed-top\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"navbar-header\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"navbar-toggle\"],[\"static-attr\",\"data-toggle\",\"collapse\"],[\"static-attr\",\"data-target\",\"#myNavbar\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"block\",[\"link-to\"],[\"index\"],null,6],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"collapse navbar-collapse\"],[\"static-attr\",\"id\",\"myNavbar\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav\"],[\"flush-element\"],[\"text\",\"\\n\\n        \"],[\"block\",[\"link-to\"],[\"index\"],[[\"tagName\"],[\"li\"]],5],[\"text\",\"\\n \"],[\"block\",[\"link-to\"],[\"libraries\"],[[\"tagName\"],[\"li\"]],4],[\"text\",\"\\n\\n \"],[\"block\",[\"link-to\"],[\"contact\"],[[\"tagName\"],[\"li\"]],3],[\"text\",\"\\n \"],[\"block\",[\"link-to\"],[\"about\"],[[\"tagName\"],[\"li\"]],2],[\"text\",\"\\n\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav navbar-right\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"dropdown\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"dropdown-toggle\"],[\"static-attr\",\"data-toggle\",\"dropdown\"],[\"static-attr\",\"role\",\"button\"],[\"static-attr\",\"aria-haspopup\",\"true\"],[\"static-attr\",\"aria-expanded\",\"false\"],[\"flush-element\"],[\"text\",\"\\n            Admin\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"caret\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"dropdown-menu\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"block\",[\"link-to\"],[\"admin.invitations\"],[[\"tagName\"],[\"li\"]],1],[\"text\",\"\\n          \"],[\"block\",[\"link-to\"],[\"admin.feedbacks\"],[[\"tagName\"],[\"li\"]],0],[\"text\",\"\\n\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Feedbacks\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Subscribers\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"About\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Contact\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Libraries\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Home\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"navbar-brand\"],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Logo\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/application.hbs" } });
});
define("flibrary/templates/components/about-component", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "KYz+bkDI", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"About Page\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/components/about-component.hbs" } });
});
define("flibrary/templates/components/contact-component", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "BEnvOuf5", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Contact page\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"well\"],[\"flush-element\"],[\"text\",\"If you have any question or feedback please leave a message with your email address.\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"form-group has-feedback \",[\"helper\",[\"if\"],[[\"get\",[\"isEmailValid\"]],\"has-success\"],null]]]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"inputEmail\"],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Email\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-4\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"class\",\"id\",\"placeholder\",\"value\"],[\"form-control\",\"inputEmail\",\"Email\",[\"get\",[\"email\"]]]]],false],[\"text\",\"\\n      \"],[\"block\",[\"if\"],[[\"get\",[\"isEmailValid\"]]],null,2],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"form-group has-feedback \",[\"helper\",[\"if\"],[[\"get\",[\"isMessageEnoughLong\"]],\"has-success\"],null]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"feedback\"],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Your message*:\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-5\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"id\",\"placeholder\",\"rows\",\"value\"],[\"form-control\",\"feedback\",\"Your message. (At least 5 characters.)\",\"5\",[\"get\",[\"message\"]]]]],false],[\"text\",\"\\n          \"],[\"block\",[\"if\"],[[\"get\",[\"isMessageEnoughLong\"]]],null,1],[\"text\",\"\\n        \"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-offset-2 col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"dynamic-attr\",\"disabled\",[\"unknown\",[\"isValid\"]],null],[\"modifier\",[\"action\"],[[\"get\",[null]],\"sucess\"]],[\"flush-element\"],[\"text\",\"Send\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"sucessMessage\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"alert alert-success alert-dismissable\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"static-attr\",\"class\",\"close\"],[\"static-attr\",\"data-dismiss\",\"alert\"],[\"static-attr\",\"aria-label\",\"close\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"again\"]],[\"flush-element\"],[\"text\",\"×\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"h4\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"sucessMessage\"]],false],[\"close-element\"],[\"text\",\"\\n           \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"To: \"],[\"append\",[\"unknown\",[\"getEmail\"]],false],[\"close-element\"],[\"text\",\"\\n           \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Message: \"],[\"append\",[\"unknown\",[\"getMessage\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[\"flush-element\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[\"flush-element\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/components/contact-component.hbs" } });
});
define("flibrary/templates/components/editbook-component", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "88k7zat6", "block": "{\"statements\":[[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-pills\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"active\"],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"data-toggle\",\"pill\"],[\"static-attr\",\"href\",\"#home\"],[\"flush-element\"],[\"text\",\"Edit Book\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"data-toggle\",\"pill\"],[\"static-attr\",\"href\",\"#addBook\"],[\"flush-element\"],[\"text\",\"Add Book\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tab-content\"],[\"static-attr\",\"style\",\"padding-top:20px\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"home\"],[\"static-attr\",\"class\",\"tab-pane fade in active\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"library\",\"book\"]]],null,0],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"addBook\"],[\"static-attr\",\"class\",\"tab-pane fade\"],[\"flush-element\"],[\"text\",\"\\n\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Title:\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-5\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"tempBook\",\"title\"]],\"form-control\",\"Title of the Book\"]]],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Author:\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-5\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"tempBook\",\"author\"]],\"form-control\",\"Author of the library\"]]],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Year:\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-5\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"tempBook\",\"year\"]],\"form-control\",\"Year of publishing\"]]],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-offset-2 col-sm-5\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveLibrary\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"text\",\"Add\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal fade\"],[\"static-attr\",\"id\",\"myModalHorizontal\"],[\"static-attr\",\"tabindex\",\"-1\"],[\"static-attr\",\"role\",\"dialog\"],[\"static-attr\",\"aria-labelledby\",\"myModalLabel\"],[\"static-attr\",\"aria-hidden\",\"true\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-dialog\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-content\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"comment\",\" Modal Header \"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-header\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"close\"],[\"static-attr\",\"data-dismiss\",\"modal\"],[\"flush-element\"],[\"text\",\"\\n                       \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"aria-hidden\",\"true\"],[\"flush-element\"],[\"text\",\"×\"],[\"close-element\"],[\"text\",\"\\n                       \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"sr-only\"],[\"flush-element\"],[\"text\",\"Close\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"h4\",[]],[\"static-attr\",\"class\",\"modal-title\"],[\"static-attr\",\"id\",\"myModalLabel\"],[\"flush-element\"],[\"text\",\"\\n                    Edit Book\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\\n            \"],[\"comment\",\" Modal Body \"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-body\"],[\"flush-element\"],[\"text\",\"\\n\\n              \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\",\"disabled\"],[\"text\",[\"get\",[\"books\",\"title\"]],\"form-control\",\"The name of the Library\",\"true\"]]],false],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Address\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\",\"disabled\"],[\"text\",\"\",\"form-control\",\"The address of the Library\",\"true\"]]],false],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Phone\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\",\"disabled\"],[\"text\",\"\",\"form-control\",\"The phone number of the Library\",\"true\"]]],false],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n\\n\\n            \"],[\"close-element\"],[\"text\",\"\\n\\n            \"],[\"comment\",\" Modal Footer \"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-footer\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-default\"],[\"static-attr\",\"data-dismiss\",\"modal\"],[\"flush-element\"],[\"text\",\"\\n                            Close\\n                \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-primary\"],[\"flush-element\"],[\"text\",\"\\n                    Save changes\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-4\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-default\"],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"h3\",[]],[\"static-attr\",\"class\",\"panel-title\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"books\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Author: \"],[\"append\",[\"unknown\",[\"books\",\"author\"]],false],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Year: \"],[\"append\",[\"unknown\",[\"books\",\"year\"]],false],[\"close-element\"],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-footer\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-primary btn-xs\"],[\"static-attr\",\"data-toggle\",\"modal\"],[\"static-attr\",\"data-target\",\"#myModalHorizontal\"],[\"flush-element\"],[\"text\",\"Edit\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger btn-xs\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteBook\",[\"get\",[\"books\"]]]],[\"flush-element\"],[\"text\",\"delete\"],[\"close-element\"],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"books\"]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/components/editbook-component.hbs" } });
});
define("flibrary/templates/components/index-component", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "c/oRj4SE", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"jumbotron text-center\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Our Library\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Subscribe to get latest Book Releases\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-horizontal form-group form-group-lg row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1 col-md-5 col-md-offset-2\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\",\"class\",\"placeholder\",\"autofocus\"],[[\"get\",[\"emailAddress\"]],\"form-control\",\"Please type your e-mail address.\",\"autofocus\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-xs-10 col-xs-offset-1 col-sm-offset-0 col-sm-4 col-md-3\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"disabled\",[\"unknown\",[\"isDisabled\"]],null],[\"static-attr\",\"class\",\"btn btn-primary btn-lg btn-block\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveInvitation\"]],[\"flush-element\"],[\"text\",\"Subscribe\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"responseMessage\"]]],null,0],[\"text\",\"\\n  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"     \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"alert alert-success alert-dismissable\"],[\"flush-element\"],[\"text\",\"\\n       \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"static-attr\",\"class\",\"close\"],[\"static-attr\",\"data-dismiss\",\"alert\"],[\"static-attr\",\"aria-label\",\"close\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"againn\"]],[\"flush-element\"],[\"text\",\"×\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"append\",[\"unknown\",[\"responseMessage\"]],false],[\"text\",\"\\n     \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/components/index-component.hbs" } });
});
define("flibrary/templates/contact", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "9l0GVRwG", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"contact-component\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/contact.hbs" } });
});
define("flibrary/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ZxdiP0Ma", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"index-component\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/index.hbs" } });
});
define("flibrary/templates/libraries", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "F6+/KN7E", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"static-attr\",\"style\",\"padding-top: 20px\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"well\"],[\"static-attr\",\"style\",\" margin-bottom: 0px !important\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-pills\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"block\",[\"link-to\"],[\"libraries.index\"],[[\"tagName\"],[\"li\"]],1],[\"text\",\"\\n    \"],[\"block\",[\"link-to\"],[\"libraries.new\"],[[\"tagName\"],[\"li\"]],0],[\"text\",\"\\n\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Add new\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"List all\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/libraries.hbs" } });
});
define("flibrary/templates/libraries/edit", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "fJ9x8wH7", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-fluid text-center\"],[\"static-attr\",\"style\",\"background-color:#383d52\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"label  label-primary\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"close-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"well\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-pills\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"block\",[\"link-to\"],[\"libraries.edit.index\"],[[\"tagName\"],[\"li\"]],1],[\"text\",\"\\n    \"],[\"block\",[\"link-to\"],[\"libraries.edit.editbook\"],[[\"tagName\"],[\"li\"]],0],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Edit Library\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"View Library\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/libraries/edit.hbs" } });
});
define("flibrary/templates/libraries/edit/editbook", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "kLY8cwuf", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"model\",\"name\"]],\"form-control\",\"The name of the Library\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Address\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"model\",\"address\"]],\"form-control\",\"The address of the Library\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Phone\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"model\",\"phone\"]],\"form-control\",\"The phone number of the Library\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-offset-2 col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveLibrary\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"text\",\"Save changes\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"editbook-component\"],null,[[\"library\"],[[\"get\",[\"model\"]]]]],false],[\"text\",\"\\n\\n\"],[\"comment\",\"\\n<div class=\\\"well\\\">\\n  <ul class=\\\"nav nav-pills\\\">\\n    {{#link-to 'libraries.edit.editbook.bookedit' tagName=\\\"li\\\"}}<a href=\\\"\\\">Edit Boooks</a>{{/link-to}}\\n    {{#link-to 'libraries.edit.editbook.addbook' tagName=\\\"li\\\"}}<a href=\\\"\\\">Add Books</a>{{/link-to}}\\n  </ul>\\n</div>\\n{{outlet}}\\n\\n\\n\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/libraries/edit/editbook.hbs" } });
});
define("flibrary/templates/libraries/edit/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "qkxZ/9pc", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\",\"disabled\"],[\"text\",[\"get\",[\"model\",\"name\"]],\"form-control\",\"The name of the Library\",\"true\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Address\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\",\"disabled\"],[\"text\",[\"get\",[\"model\",\"address\"]],\"form-control\",\"The address of the Library\",\"true\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Phone\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-6\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\",\"disabled\"],[\"text\",[\"get\",[\"model\",\"phone\"]],\"form-control\",\"The phone number of the Library\",\"true\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"label label-primary\"],[\"flush-element\"],[\"text\",\"Books List\"],[\"close-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"book\"]]],null,0],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-4\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-default\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"h3\",[]],[\"static-attr\",\"class\",\"panel-title\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"books\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Author: \"],[\"append\",[\"unknown\",[\"books\",\"author\"]],false],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Year: \"],[\"append\",[\"unknown\",[\"books\",\"year\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"books\"]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/libraries/edit/index.hbs" } });
});
define("flibrary/templates/libraries/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "jOrDLffp", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"static-attr\",\"style\",\"padding-top:20px;\"],[\"flush-element\"],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,1],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"View\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-4\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-default\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"h3\",[]],[\"static-attr\",\"class\",\"panel-title\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"library\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Address: \"],[\"append\",[\"unknown\",[\"library\",\"address\"]],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Phone: \"],[\"append\",[\"unknown\",[\"library\",\"phone\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-footer\"],[\"static-attr\",\"style\",\"margin-left: 0 !important, margin-right: 0 !important\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-fluid\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-6 text-left\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Number of books:\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"badge\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"library\",\"book\",\"length\"]],false],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-6 text-right\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"block\",[\"link-to\"],[\"libraries.edit\",[\"get\",[\"library\",\"id\"]]],[[\"class\"],[\"btn btn-success btn-xs\"]],0],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger btn-xs\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteLibrary\",[\"get\",[\"library\"]]]],[\"flush-element\"],[\"text\",\"Delete\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"library\"]}],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/libraries/index.hbs" } });
});
define("flibrary/templates/libraries/new", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ago3NXuY", "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Add a new local Library\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"model\",\"name\"]],\"form-control\",\"The name of the Library\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Address\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"model\",\"address\"]],\"form-control\",\"The address of the Library\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"text\",\"Phone\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"model\",\"phone\"]],\"form-control\",\"The phone number of the Library\"]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-offset-2 col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveLibrary\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"text\",\"Add to library list\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "flibrary/templates/libraries/new.hbs" } });
});
define('flibrary/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, _emberfireToriiProvidersFirebase) {
  exports['default'] = _emberfireToriiProvidersFirebase['default'];
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('flibrary/config/environment', ['ember'], function(Ember) {
  var prefix = 'flibrary';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("flibrary/app")["default"].create({"name":"flibrary","version":"0.0.0+3ec254ef"});
}

/* jshint ignore:end */
//# sourceMappingURL=flibrary.map
