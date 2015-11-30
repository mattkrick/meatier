
export class DatabaseConnectionError extends Error {
  constructor(message) {
    super();
    this.name = 'DatabaseConnectionError';
    this.message = message || 'Error reaching database, please try again';
  }
}

export class DocumentNotFoundError extends Error {
  constructor(message) {
    super();
    //same name thinky uses
    this.name = 'DocumentNotFoundError';
    this.message = message || 'Document not found';
  }
}

export class AuthorizationError extends Error {
  constructor(message) {
    super();
    this.name = 'AuthorizationError';
    this.message = message || 'Not authorized to view document';
  }
}
