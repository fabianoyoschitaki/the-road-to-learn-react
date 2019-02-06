import React, { Component } from 'react';
import Search from '../Search';
import Button from '../Button';
import Table from '../Table';
import './index.css';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';

const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 10;

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
            Search
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

/** function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
} or the arrow function below with high order functions **/
// const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

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

export default App;