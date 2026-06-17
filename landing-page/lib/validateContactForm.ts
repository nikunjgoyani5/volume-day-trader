import type { CountryCode } from "libphonenumber-js";
import { isValidContactPhone } from "@/lib/phone";

export type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactFormErrorKey = keyof ContactFormValues;

export type ContactFormErrors = Partial<Record<ContactFormErrorKey, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactValidationMessages = {
  required: string;
  emailInvalid: string;
  phoneInvalid: string;
  messageMin: string;
};

export function validateContactForm(
  values: ContactFormValues,
  phoneCountry: CountryCode,
  phoneNational: string,
  messages: ContactValidationMessages
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = messages.required;
  }
  if (!values.lastName.trim()) {
    errors.lastName = messages.required;
  }
  if (!values.email.trim()) {
    errors.email = messages.required;
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = messages.emailInvalid;
  }
  if (!phoneNational.trim()) {
    errors.phone = messages.required;
  } else if (!isValidContactPhone(phoneCountry, phoneNational)) {
    errors.phone = messages.phoneInvalid;
  }
  if (!values.message.trim()) {
    errors.message = messages.required;
  } else if (values.message.trim().length < 10) {
    errors.message = messages.messageMin;
  }

  return errors;
}
