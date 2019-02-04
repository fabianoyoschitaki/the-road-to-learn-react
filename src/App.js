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

/** function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
} or the arrow function below with high order functions **/
const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props){
    super(props);
    
    this.state = {
      //list: list, because the list variable name is called list, we can declare only list,
      list,
      searchTerm: '',
    };

    //The function is bound to the class and thus becomes a class method. You have to bind class methods in the constructor.
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id){
    /** function isNotId(item){
      return item.objectID !== id;
    }
    const updatedList = this.state.list.filter(isNotId);
    **/
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  }

  onSearchChange(event){
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    //ES6 destructuring to shorten filter and map methods
    const { list, searchTerm}  = this.state;
    return (
        <div className="App">
          <Search
            //uncontrolled components should be controlled input, textArea, select
            value={searchTerm}
            onChange={this.onSearchChange}>
            Search
          </Search>
          <Table
            list={list}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        </div>
    );
  }
}

const Search = ({value, onChange, children}) => 
  <form>
    { children } <input 
      type="text" 
      onChange={onChange}
      //uncontrolled components should be controlled input, textArea, select
      value={value}
      />
  </form>

/** Replaced by const Search 
  // for functional stateless components we can destructure
  //function Search(props) {
  function Search({value, onChange, children}){
    
    Notice the this.props object. The props - short form for properties - have all the values you 
    have passed to the components when you used them in your App component. You could reuse these 
    components somewhere else but pass them different values. They are reusable.
    //const { value, onChange, children } = this.props;
    
    return (
      <form>
        { children } <input 
          type="text" 
          onChange={onChange}
          //uncontrolled components should be controlled input, textArea, select
          value={value}
          />
      </form>
    );  
  }
**/

const Table = ({list, pattern, onDismiss}) =>
  //ES6 destructuring
  //const {list, pattern, onDismiss } = this.props;
  <div>
    { list.filter(isSearched(pattern)).map(item => 
        <div key={item.objectID}>
          <span>
            <a href={item.url}>{item.title}</a>
          </span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span>
          <span>
            <Button
              onClick={() => onDismiss(item.objectID)}>
              Dismiss
            </Button>
          </span>
        </div>
      )}
  </div>

const Button = ({onClick, className = '', children}) =>
    /**
    const {
      onClick, 
      className = '', ////You can use a JavaScript ES6 feature: the default parameter because className is optional
      children
    } = this.props;**/
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>

export default App;
