
import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  tempBook:{
    title:"",
    author:"",
    year:""
  },
  getTempBook:Ember.computed('tempBook',function(){
    return this.get('tempBook');
  }),
  actions:{
    deleteBook(book){
      let books=this.get('library.book');
      let index=books.indexOf(book);
      if(index===0){
        alert("Request Denied! Not allowed to  delete all books");
        this.get('router').transitionTo('libraries.edit.index');
      }
      else{
      books.splice(index,1);
      this.get('library').set('book',books);
      this.get('library').save().then(() => {
        console.log("succesfully added");
        //this.get('router').transitionTo('libraries.edit.index');
      });
    }
      //console.log("the index is "+ id);
      //books[id].remove();
      //console.log(books);
    } ,
     saveLibrary(){
      if(this.get('library.book').length===1)
      {
        let book = this.get('library').get('book')[0];
        if(book.title==="empty")
        {
          console.log("empty one");
          this.get('library').set('book',[this.get('getTempBook')]);
          this.get('library').save().then(() => {
            console.log("succesfully added");
            this.get('router').transitionTo('libraries.edit.index');
          });
        }
        else{
          let books=this.get('library.book');
          books.push(this.get('tempBook'));
          console.log(books);
          this.get('library').set('book',books);
          this.get('library').save().then(() => {
            console.log("succesfully added");
            this.get('router').transitionTo('libraries.edit.index');
          });
        }
      }
      else{
      let books=this.get('library.book');
      books.push(this.get('tempBook'));
      console.log(books);
      this.get('library').set('book',books);
      this.get('library').save().then(() => {
        console.log("succesfully added");
        this.get('router').transitionTo('libraries.edit.index');
      });
    }

    }
  }
});
