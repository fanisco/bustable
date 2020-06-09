const exceptionHandler = (err, res) => {
    const {code, message} = err;
    res.status(code || 500).json({
        status: 'error',
        code,
        message
    });
};

export default exceptionHandler;
