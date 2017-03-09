import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.get('store').findAll('library');
  },
  actions: {

    deleteLibrary(library) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
        library.destroyRecord();
      }
    }
  }

});
