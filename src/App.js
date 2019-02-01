import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
];

class App extends Component {

  constructor(props){
    super(props);
    
    this.state = {
      //list: list, because the list variable name is called list, we can declare only list,
      list,
    };

    //The function is bound to the class and thus becomes a class method. You have to bind class methods in the constructor.
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss(id){
    /** function isNotId(item){
      return item.objectID !== id;
    }
    const updatedList = this.state.list.filter(isNotId);
    **/
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({list: updatedList});
    console.log(this.state.list);
  }

  render() {
    const helloWorld = {
      text: 'Welcome to React!'
    };
  
    helloWorld.text = 'Hot Reloading Module';
    return (
        <div className="App">
          <form>
            <input type="text" />
          </form>
          {
            this.state.list.map(item => 
              <div key={item.objectID}>
                <span>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span>{item.author}</span>
                <span>{item.num_comments}</span>
                <span>{item.points}</span>
                <span>
                  <button type="button" onClick={() =>  this.onDismiss(item.objectID)}>
                    Dismiss
                  </button>
                </span>
              </div>
            )
          }
        </div>
    );
  }
}

export default App;
