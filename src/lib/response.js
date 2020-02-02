module.exports = class Response {
  constructor(success, message, data, status) {
    this.message = message;
    this.success = success;
    this.data = data;
    this.status = status;
  }

  /** @argument { Object } data @argument { number } status  */
  static success(data, status = 200) {
    return new Response(true, '', data, status);
  }

  /** @argument { string } message @argument { Object } data @argument { number } status  */
  static failure(message, status = 400, data = null) {
    return new Response(false, message, data, status);
  }

  /** @argument { import('express').Response } res  */
  send(res) {
    const dataToSend = { ...this };
    delete dataToSend.status; // prevent sending the status code
    if (!res.headersSent) res.status(this.status).send(dataToSend);
  }
};
