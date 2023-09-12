const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');
// for preventing users from inputing html tags 
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
// ===============================================================================================================================================
const joi = BaseJoi.extend(extension)
module.exports.campJoi = joi.object({
    title: joi.string().required().escapeHTML(),
    price: joi.number().required().min(0),
    location: joi.string().required().escapeHTML(),
    description: joi.string().required().escapeHTML(),
    deleteImages:joi.array(),
})
module.exports.reviewJoi = joi.object({
    body: joi.string().required().escapeHTML(),
    rating: joi.number().required().min(0).max(5),
})