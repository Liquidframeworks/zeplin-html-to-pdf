process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
const wkhtmltopdf = require("./utils/wkhtmltopdf");
const errorUtil = require("./utils/error");

exports.handler = function handler(event, context, callback) {
    console.log(event.body);
    console.log(JSON.parse(event.body));

        var request = JSON.parse(event.body);
        if (!request.html) {
            const errorResponse = errorUtil.createErrorResponse(400, "Validation error: Missing field 'html'.");
            callback(errorResponse);
            return;
        }

        wkhtmltopdf(request.html)
            .then(buffer => {
                callback(null, {
                    statusCode: 200,
                    headers: {
                        "Content-Type": "*/*"
                    },
                    body: { data: buffer.toString("base64") }
                });
            }).catch(error => {
                callback(errorUtil.createErrorResponse(500, "Internal server error", error));
            });


};