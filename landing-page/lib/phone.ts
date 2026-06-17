import {
  getCountryCallingCode,
  isValidPhoneNumber,
  type CountryCode,
} from "libphonenumber-js";

export function toE164Phone(country: CountryCode, nationalNumber: string): string {
  const digits = nationalNumber.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  return `+${getCountryCallingCode(country)}${digits}`;
}

export function isValidContactPhone(
  country: CountryCode,
  nationalNumber: string
): boolean {
  const e164 = toE164Phone(country, nationalNumber);
  if (!e164) {
    return false;
  }
  return isValidPhoneNumber(e164, country);
}
