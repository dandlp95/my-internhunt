// Create a class to make creating calls to the database easier.
import { getApiRoot } from "./getApiRoot";
class FetchCalls {
  constructor(endpoint, method, token = null, body = null) {
    this.endpoint = endpoint;
    this.method = method;
    this.token = token;
    this.body = body;
  }

  async publicGet() {
    const options = {
      method: this.method,
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await fetch(getApiRoot() + this.endpoint, options);
    console.log(response);
    return response;
  }
  async protectedNoBody() {
    const options = {
      method: this.method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    };
    const response = await fetch(getApiRoot() + this.endpoint, options);

    return response;
  }

  async protectedBody() {
    const options = {
      method: this.method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(this.body),
    };
    const response = await fetch(getApiRoot() + this.endpoint, options);
    return response;
  }

  async publicBody() {
    const options = {
      method: this.method,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(this.body),
    };
    const response = await fetch(getApiRoot() + this.endpoint, options);
    return response;
  }
}

export default FetchCalls;
