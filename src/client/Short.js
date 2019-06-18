import React, { Component } from 'react';
import { deviceDetect } from 'react-device-detect';

export default class Short extends Component {
    
    redirectToShortUrl = () => {
        console.log('url params', this.props);
        const { shortCode } = this.props.match.params;
        const visitorInfo = deviceDetect();
        fetch("/shorti", {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ short: shortCode, visitorInfo })
          })
            .then(res => res.json())
            .then(
              (result) => {
                console.log('url shortener generated', result);
                window.location.replace(result.url);
                // this.setState({
                //   isLoaded: true,
                //   items: result.items
                // });
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

    componentDidMount() {
        this.redirectToShortUrl();
        console.log('deviceDetect', deviceDetect());
    }
    render() {
        return (
            <div>
            </div>
        );
    }
}
