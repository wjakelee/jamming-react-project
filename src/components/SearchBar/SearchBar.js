import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
  constructor(props){
    super(props);

    this.state = { term: '' };

    //bind methods to class
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }
  
  //method passes search term state to search method in App.js
  search(){
    this.props.onSearch(this.state.term);
  }

  //method sets the state of search term as it is inputed be the user
  handleTermChange(e){
    this.setState(
      { term: e.target.value }
    )
  }
  
  render(){
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
                onChange={this.handleTermChange}/>
        <button className="SearchButton"
                onClick={this.search}>SEARCH</button>
      </div>
    );
  }
}

export default SearchBar;