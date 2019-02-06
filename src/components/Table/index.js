import React, { Component } from 'react';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import Button from '../Button'
import PropTypes from 'prop-types'

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
}

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

export default Table;