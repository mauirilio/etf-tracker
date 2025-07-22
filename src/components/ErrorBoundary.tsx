import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert } from "react-bootstrap";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-4">
            <Alert variant="danger">
                <Alert.Heading>Oops! Algo deu errado.</Alert.Heading>
                <p>
                    A aplicação encontrou um erro inesperado e não pôde continuar.
                </p>
                <hr />
                <p className="mb-0">
                    <strong>Detalhes do erro:</strong>
                </p>
                <pre>
                    {this.state.error?.message || 'Erro desconhecido'}
                </pre>
            </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
