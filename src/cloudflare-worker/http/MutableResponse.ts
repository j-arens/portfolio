export type MutableResponseProperties = {
  body: string;
  status: number;
  statusText: string;
  headers: Headers;
};

class MutableResponse {
  protected _body = '';
  protected _status = 200;
  protected _statusText = '';
  protected _headers: Headers = new Headers();

  body(value: string): MutableResponse {
    this._body = value;
    return this;
  }

  status(value: number): MutableResponse {
    this._status = value;
    return this;
  }

  statusText(value: string): MutableResponse {
    this._statusText = value;
    return this;
  }

  header(key: string, value: string): MutableResponse {
    this._headers.set(key, value);
    return this;
  }

  json(value: object): MutableResponse {
    this._body = JSON.stringify(value);
    this._headers.set('Content-type', 'application/json');
    return this;
  }

  properties(): MutableResponseProperties {
    return {
      body: this._body,
      status: this._status,
      statusText: this._statusText,
      headers: this._headers,
    };
  }
}

export default MutableResponse;
