module.exports = class Response {
  /**
   * @param {string} success
   * @param {string} message
   * @param {string} data
   * @param {number} status
   *
   * @return {void}
   */
  constructor(success, message, data, status) {
    this.message = message;
    this.success = success;
    this.data = data;
    this.status = status;
  }

  /**
   * @param {object} data
   * @param {status} status
   *
   * @return {object}
   */
  static success(data, status = 200) {
    return new Response(true, '', data, status);
  }

  /**
   * @param {string} message
   * @param {number} status
   * @param {object} data
   *
   * @return {object}
   */
  static failure(message, status = 400, data = null) {
    return new Response(false, message, data, status);
  }

  /**
   * @param {object} res
   *
   * @return {void}
   */
  send(res) {
    const dataToSend = {...this};
    delete dataToSend.status; // prevent sending the status code
    if (!res.headersSent) res.status(this.status).send(dataToSend);
  }
};
