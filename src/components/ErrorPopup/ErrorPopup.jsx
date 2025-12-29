import React, { Component } from "react";
import styles from "./ErrorPopup.module.scss";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorHistory: [],
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorHistory: [
        ...prevState.errorHistory,
        { error: error.toString(), componentStack: errorInfo.componentStack },
      ],
    }));
  }

  handleClosePopup = () => {
    this.setState({ hasError: false });
  };

  handleStopPropagation = (e) => {
    e.stopPropagation();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={styles.errorPopupContainer}
          onClick={this.handleStopPropagation}
        >
          <div className={styles.errorPopup}>
            <button
              onClick={this.handleClosePopup}
              className={styles.closeButton}
            >
              X
            </button>
            <h2 className={styles.errorPopupTitle}>Что-то пошло не так.</h2>
            <div className={styles.errorHistory}>
              {this.state.errorHistory.map((error, index) => (
                <details key={index} className={styles.errorDetails}>
                  <summary className={styles.errorSummary}>
                    Ошибка {index + 1}
                  </summary>
                  <p className={styles.errorText}>{error.componentStack}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
