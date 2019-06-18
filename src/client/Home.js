import React, { Component } from 'react';

export default class Home extends Component {

  state = { url: '', urlList: [], activeList: -1, recentGenerated: '', error: '', loading: true };

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
          if (result.url) {
            this.setState({
              recentGenerated: result.url ? result.url.short : null,
              error: result.message,
              loading: false
            });
          } else {
            alert(error);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log('error generated shortener', error);
          this.setState({
            error,
            loading: false
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
          this.setState({ urlList: result.list, loading: false }); 
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log('got error', error);
          this.setState({ loading: false });
        }
      )
  }

  setActive = index => {
    const { activeList } = this.state;
    console.log('set active index', activeList, index);
    if (activeList !== index) {
      this.setState({ activeList: index });
    }
  };

  componentDidMount() {
    this.fetchAllUrls();
  }

    render() {
        const { url, urlList, activeList, recentGenerated, loading } = this.state;
        return (
            <div>
                <h1>URL shortener</h1>
                <div>
                <input type="text" value={url} className="input" onChange={this.getUrlValue} />
                <button className="button" onClick={this.getShortenedUrl}>
                    Submit
                </button>
                </div>

                {recentGenerated.length > 0 && <div className="new">
                  <h2>GENERATE NEW URL GENERATED</h2>
                  <a href={`https://url-shortner-54.herokuapp.com/${recentGenerated}`}>https://url-shortner-54.herokuapp.com/{recentGenerated}</a>
                </div>}

                <div className="links-list">
                    <div className="list-head">
                      <div className="code">
                        Short Code
                      </div>
                      <div className="url">
                        URL
                      </div>
                    </div>
                  {loading && <p>Loading...</p>}
                  {urlList.length > 0 && urlList.map((item, index) => (
                    <div className="item-container">
                      <div className="list-item" onClick={() => this.setActive(index)}>
                        <div className="code">
                          https://url-shortner-54.herokuapp.com/short/{item.short}
                        </div>
                        <div className="url">
                          <a href={item.url}>{item.url}</a>
                        </div>
                      </div>
                      <div className={`visitor-list ${activeList === index ? 'show-info' : ''}`}>
                        <div className="ip visitor-head visitor-key">
                          IP
                        </div>
                        <div className="browserName visitor-head visitor-key">
                          Browser Name
                        </div>
                        <div className="osName visitor-head visitor-key">
                          OS Name
                        </div>
                        <div className="city visitor-head visitor-key">
                          City
                        </div>
                        <div className="country visitor-head visitor-key">
                          Country
                        </div>
                        {item.visitor ? null : <p><b>No one has visit this link.</b></p>}
                          {item.visitor && item.visitor.list.map(visitor => (
                            <div className="visitor-info">
                              <div className="ip visitor-key">
                                {visitor.ip}
                              </div>
                              <div className="browserName visitor-key">
                                {visitor.browserName}
                              </div>
                              <div className="osName visitor-key">
                                {visitor.osName.length > 0 ? visitor.osName : visitor.mobileVendor}
                              </div>
                              <div className="city visitor-key">
                                {visitor.city}
                              </div>
                              <div className="country visitor-key">
                                {visitor.country}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        );
    }
}