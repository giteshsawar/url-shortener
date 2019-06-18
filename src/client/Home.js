import React, { Component } from 'react';

export default class Home extends Component {

  state = { url: '', urlList: [] };

  getUrlValue = e => {
    this.setState({ url: e.target.value });
  };

  getShortenedUrl = () => {
    const { url } = this.state;
    console.log('url to senf', url);
    fetch("/url/generateShortUrl", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log('url shortener generated', result);
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log('error generated shortener', error);
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  fetchAllUrls = () => {
    fetch("/url/getAllUrls", {
      method: 'get' 
    })
    .then(res => res.json())
      .then(
        (result) => {
          console.log('got all urls', result);  
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log('got error', error);
        }
      )
  }

  componentDidMount() {
    this.fetchAllUrls();
  }

    render() {
        const { url } = this.state;
        return (
            <div>
                <h1>URL shortener</h1>
                <div>
                <input type="text" value={url} className="input" onChange={this.getUrlValue} />
                <button className="button" onClick={this.getShortenedUrl}>
                    Submit
                </button>
                </div>
            </div>
        );
    }
}