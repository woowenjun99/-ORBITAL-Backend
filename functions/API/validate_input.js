/**
 * @author: Wen Jun
 * @since 0.0.0
 *
 * @description: As part of the Single Responsibility Principle,
 * this file is a single software component with only one
 * responibility -- To validate the inputs by the user.
 *
 * 
 * RESPONSIBILITY: To validate the user's input into the form:
 *  1. COHESION: High. Contains all of the validation modules
 * 
 *  2. Coupling: Loose. If we change the package, we we can change
 *     all these code easily and adapt it to the new code.
 * 
 *  3. REASON TO CHANGE: A change in the validation package
 */

const Joi = require('joi');

exports.validateListingFormInputs = (
  name,
  description,
  typeOfTransaction,
  deliveryInformation
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    typeOfTransaction: Joi.string().required(),
    deliveryInformation: Joi.string().required(),
  });

  return schema.validate({
    name: name,
    description: description,
    typeOfTransaction: typeOfTransaction,
    deliveryInformation: deliveryInformation,
  });
};
