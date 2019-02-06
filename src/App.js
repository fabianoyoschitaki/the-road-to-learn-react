import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';

/** MOCK DATA
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
**/
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';

const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 10;

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
}

/** function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
} or the arrow function below with high order functions **/
const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

/**
That’s it. The function over an object approach in setState() fixes potential bugs yet increases
readability and maintainability of your code.
 */
const updateSearchTopstoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;
  
  const oldHits = results && results[searchKey] 
    ? results[searchKey].hits 
    : [];
    
  const updatedHits = [ 
    ...oldHits, 
    ...hits
  ];

  return {
    //result : { hits: updatedHits, page: page } because the variable name page is the same, don't need to use :
    results : { 
      ...results,
      [searchKey]: {hits: updatedHits, page }
    },
    isLoading: false
  };
};

class App extends Component {

  /**
    The constructor
   */
  constructor(props){
    super(props);
    this.state = {
      //list: list, because the mocked list variable name is called list, we can declare only list,
      //list, commented because we're fetching real API
      //searchTerm: '', commented because we're fetching real API
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,      
    };

    //The function is bound to the class and thus becomes a class method. You have to bind class methods in the constructor.
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);

    //Fetching API
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);

    //When submitting, call API again
    this.onSearchSubmit = this.onSearchSubmit.bind(this);

    //To prevent request in case it's already in the client cache
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
  }

  render() {
    //ES6 destructuring to shorten filter and map methods
    const { 
      searchTerm,
      results, 
      searchKey,
      isLoading,     
    }  = this.state;
    
    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page
    ) || 0;
    
    const list = (
      results && 
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            //uncontrolled components should be controlled input, textArea, select
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search:
          </Search>
        </div>
        <Table
          list={list}
          onDismiss={this.onDismiss}          
        />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={ isLoading }
            onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}
            className="button-inline">
            More
          </ButtonWithLoading>      
        </div>   
      </div>
    );
  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    
    if (this.needsToSearchTopstories(searchTerm)){
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }
    
    event.preventDefault();
  }

  onDismiss(id){
    const { searchKey, results } = this.state;    
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    
    this.setState({ 
      //ES5 result: Object.assign({}, this.state.result, { hits: updatedHits })
      results: { 
        ...results, 
        [searchKey]: {hits: updatedHits, page }
      }
    });    
  }

  onSearchChange(event){
    this.setState({ searchTerm: event.target.value });
  }

  needsToSearchTopstories(searchTerm){
    return !this.state.results[searchTerm];
  }

  setSearchTopstories(result){
    const { hits, page } = result;
    
    /** That will fix the issue with a stale state. */
    this.setState(updateSearchTopstoriesState(hits, page));    
  }

  fetchSearchTopstories(searchTerm, page){
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    console.log("url:", url);
    this.setState({ isLoading: true });
    fetch(url)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));    
  }

  componentDidMount(){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }
}

/** Functional Stateless Component
const Search = ({
  value, 
  onChange, 
  onSubmit, 
  children 
}) => {
  let input;
  return (
    <form onSubmit={onSubmit}>
      <input 
        type="text" 
        onChange={onChange}
        //uncontrolled components should be controlled input, textArea, select
        value={value}
        //Ref a DOM Element to focus
        ref={(node) => input = node}
      />
      <button type="submit">
        { children }
      </button>
    </form>
  );
} **/

/** ES6 class component **/
class Search extends Component {
  render(){
    const {
      value, 
      onChange, 
      onSubmit, 
      children 
    } = this.props;
    return (
      <form onSubmit={onSubmit}>
        { children } <input 
          type="text" 
          onChange={onChange}
          //uncontrolled components should be controlled input, textArea, select
          value={value}
          //Ref a DOM Element to focus
          ref={(node) => {this.input = node;}}
          />
          <button type="submit">
            { children }
          </button>
      </form>
    );
  }
  //Ref a DOM Element to focus
  componentDidMount(){
    this.input.focus();
  }
}

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

//No more filter
//const Table = ({list, pattern, onDismiss}) =>
class Table extends Component {
  /** Since you want to deal with state and methods in your component, you have to add a constructor
  and initial state.**/
  constructor(props){
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    //To sort the list
    this.onSort = this.onSort.bind(this);
  }  

  render(){
    const {
      list, 
      onDismiss
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    
    return (
      //ES6 destructuring
      //const {list, pattern, onDismiss } = this.props;
      <div className="table"> 
        <div className="table-header">
          <span style={{ width: '40%' }}>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Title
            </Sort>
          </span>
          <span style={{ width: '30%' }}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Comments
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            Archive
          </span>
        </div>
        { reverseSortedList.map(item => 
          //No more filter
          //list.filter(isSearched(pattern)).map(item => 
            <div key={item.objectID} className="table-row">
              <span style={{ width: '40%'}}>
                <a href={item.url}>{item.title}</a>
              </span>
              <span style={{ width: '30%' }}>
                {item.author}
              </span>
              <span style={{ width: '10%' }}>
                {item.num_comments}
              </span>
              <span style={{ width: '10%' }}>
                {item.points}
              </span>
              <span style={{ width: '10%' }}>
                <Button
                  onClick={() => onDismiss(item.objectID)}
                  className="button-inline">
                  Dismiss
                </Button>
              </span>
            </div>
          )}
      </div>
    );
  }

  onSort(sortKey){
    const isSortReverse = (this.state.sortKey === sortKey && !this.state.isSortReverse);
    this.setState({ sortKey, isSortReverse });
  }
}

const Button = ({ onClick, className = '', children }) =>
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

const Loading = () =>
  <div>
    <i className="fa fa-spinner fa-spin"></i>
  </div>

/**
There is one little thing that you should avoid. You pass all the props including the isLoading
property, by spreading the object, into the input component. However, the input component doesn’t
care about the isLoading property. You can use the ES6 rest destructuring to avoid it.

Spread operator:
before you would have to destructure the props before passing them
const { foo, bar } = props;
<SomeComponent foo={foo} bar={bar} />

but you can use the object spread operator to pass all object properties
<SomeComponent { ...props } />
**/
const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading/> : <Component { ...rest }/>

const ButtonWithLoading = withLoading(Button);

const Sort = ({
  sortKey, 
  activeSortKey,
  onSort, 
  children
}) => {
  
  /** The way to define the class is a bit clumsy, isn’t it? There is a neat little library to get rid of this.
  First you have to install it. npm install --save classnames
  
  const sortClass = ['button-inline'];
  if (sortKey === activeSortKey){
    sortClass.push('button-active');
  }
  **/
  //TODO use a library like Font Awesome¹⁰⁵ to indicate the (reverse) sort
  // – it could be an arrow up or down icon next to each Sort header
  const sortClass = classNames(
    'button-inline',
    { 
      'button-active': sortKey === activeSortKey      
    }
  );
  
  return (
    <Button 
      onClick={() => onSort(sortKey)}
      //className={sortClass.join(' ')}
      className={sortClass}
    >
      {children}
    </Button>
  );
}
//PropTypes
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape(
      {
        objectID: PropTypes.string.isRequired,
        author: PropTypes.string,
        url: PropTypes.string,
        num_comments: PropTypes.number,
        points: PropTypes.number,
      }
    )
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

Search.propTypes = {
  value: PropTypes.string, 
  onChange: PropTypes.func, 
  onSubmit: PropTypes.func, 
  children: PropTypes.node,
}

export default App;

export {
  Button,
  Search,
  Table,
};