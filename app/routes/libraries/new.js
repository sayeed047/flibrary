import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.createRecord('library');
  },

  actions: {

    saveLibrary(newLibrary) {
      newLibrary.set('book',[{title:"empty",author:"empty",year:"empty"}]);

      newLibrary.save().then(() => this.transitionTo('libraries'));
    },

    willTransition() {
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
