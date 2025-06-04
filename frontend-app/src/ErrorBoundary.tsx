import React, { Component } from 'react';
import { navigate } from '@reach/router';
import ErrorRedirect from './components/ErrorPage/index';

const REDIRECT_TIME = 5000; // 5 seconds

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(...p: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Error Boundary caught an error', error, info);
  }

  componentDidUpdate() {
    if (this.state.hasError) {
      setTimeout(() => {
        this.setState({ hasError: false });
        navigate('/companies/all/list/1');
      }, REDIRECT_TIME);
    }
  }

  render() {
    return this.state.hasError ? <ErrorRedirect /> : this.props.children;
  }
}

export default ErrorBoundary;
