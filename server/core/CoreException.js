export default class CoreException extends Error {
    constructor(message, code = 500) {
        super();
        this.code = code;
        this.message = message;
    }
}
