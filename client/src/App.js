import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import FormShort from './components/FormShort';

const ENPOINT_BACKEND = 'http://localhost:8000';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {
        url: '',
        slug: ''
      },
      slug: ''
    }
  }

  onSubmit = async (url, slug) => {
    const body = {
      url,
      slug: slug || undefined
    };
    if (this.state.errors.url || this.state.errors.slug) {
      this.setState({
        url: '',
        slug: '',
      });
    }
    try {
      const response = await axios.post(`${ENPOINT_BACKEND}/url/`, body);
      this.setState({
        slug: response.data.slug,
        createdUrl: `${ENPOINT_BACKEND}/${response.data.slug}`
      });
    } catch(error) {
      if (error.response.data) {
        if (error.response.data.errors) {
          this.setState({
            errors: error.response.data.errors
          });
        }
      }
    }
  }
  render() {
    return (
      <div className="container">
        
        <div className="row justify-content-center align-items-center">
          <div className="col">
            <FormShort
              onSubmit={this.onSubmit}
              errors={this.state.errors}
              createdUrl={this.state.createdUrl}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
