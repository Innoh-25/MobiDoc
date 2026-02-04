import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // You could also log the error to an error reporting service here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:24,fontFamily:'Inter, system-ui, sans-serif'}}>
          <h2 style={{color:'#b91c1c'}}>An error occurred while rendering the app</h2>
          <pre style={{whiteSpace:'pre-wrap',background:'#f8fafc',padding:12,borderRadius:6,overflowX:'auto'}}>
            {String(this.state.error && this.state.error.toString())}
            {this.state.info?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
