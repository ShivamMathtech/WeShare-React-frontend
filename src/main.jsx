import { Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { StoreProvider } from './state/Store';
import './styles.css';

class ErrorBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return <div className="fatal-error"><h1>Let’s get you back.</h1><p>Something in this local session could not be displayed. Try reloading the page.</p><button className="button button-primary" onClick={() => location.reload()}>Reload WeShare</button><p>If this keeps happening, clear this site’s browser data. This also removes your local posts and uploads.</p></div>;
    return this.props.children;
  }
}
createRoot(document.getElementById('root')).render(<ErrorBoundary><StoreProvider><App/></StoreProvider></ErrorBoundary>);
