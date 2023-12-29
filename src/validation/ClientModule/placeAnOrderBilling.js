import validator from "validator";

function validateBillingInstruction(data) {
  const errors = {};
  if (validator.isEmpty(data.ref_address.trim()))
    errors.ref_address = "Please enter address."
  if (validator.isEmpty(data.ref_contact.trim()))
    errors.ref_contact = "Please enter reference contact."
  if (validator.isEmpty(data.billing_address))
    errors.billing_address = "Please enter billing address."
  if (validator.isEmpty(data.additional_instruction.trim()))
    errors.additional_instruction = "Please enter addtional instructions."
  if (validator.isEmpty(data.payment_type.trim()))
    errors.payment_type = "Please select any one payment type."

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateBillingInstruction;