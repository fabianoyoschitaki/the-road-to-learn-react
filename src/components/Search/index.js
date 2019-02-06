import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        {/*{ children }*/} 
        <input 
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

Search.propTypes = {
  value: PropTypes.string, 
  onChange: PropTypes.func, 
  onSubmit: PropTypes.func, 
  children: PropTypes.node,
}

export default Search;

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