"use client";

import { FormEvent, useState } from "react";
import type { CountryCode } from "libphonenumber-js";
import { useTranslation } from "react-i18next";
import CtaFlowButton from "@/components/ui/cta-flow/CtaFlowButton";
import { submitInquiry } from "@/lib/api";
import {
  validateContactForm,
  type ContactFormErrors,
} from "@/lib/validateContactForm";
import { toE164Phone } from "@/lib/phone";
import PhoneField from "./PhoneField";

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const initialFields: FormFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

function FormField({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  multiline = false,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  error?: string;
}) {
  const sharedClassName =
    "w-full min-w-0 rounded-xl border border-card-border bg-[#151032] px-3 py-3 text-base text-white placeholder:text-secondary-text/50 focus:border-card-border focus:outline-none focus:ring-1 focus:ring-white/10 sm:px-4 sm:py-4 sm:text-lg";

  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5 sm:flex-1 sm:gap-2">
      <label
        htmlFor={id}
        className="text-left text-sm font-medium text-white sm:text-base lg:text-lg"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={`${sharedClassName} min-h-[112px] resize-y sm:min-h-[140px] ${
            error ? "border-red-500/70 ring-1 ring-red-500/30" : ""
          }`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={`${sharedClassName} h-12 sm:h-[58px] ${
            error ? "border-red-500/70 ring-1 ring-red-500/30" : ""
          }`}
        />
      )}
      {error ? (
        <p className="text-left text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function ContactForm() {
  const { t } = useTranslation("translation", {
    keyPrefix: "contactPage.form",
  });
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("NO");
  const [phoneNational, setPhoneNational] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [feedback, setFeedback] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  const validationMessages = {
    required: t("errors.required"),
    emailInvalid: t("errors.emailInvalid"),
    phoneInvalid: t("errors.phoneInvalid"),
    messageMin: t("errors.messageMin"),
  };

  const updateField = (key: keyof FormFields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handlePhoneCountryChange = (country: CountryCode) => {
    setPhoneCountry(country);
    setFieldErrors((current) => {
      if (!current.phone) {
        return current;
      }
      const next = { ...current };
      delete next.phone;
      return next;
    });
  };

  const handlePhoneNationalChange = (value: string) => {
    setPhoneNational(value);
    setFieldErrors((current) => {
      if (!current.phone) {
        return current;
      }
      const next = { ...current };
      delete next.phone;
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");
    setTicketNumber("");

    const phoneE164 = toE164Phone(phoneCountry, phoneNational);
    const payload = { ...fields, phone: phoneE164 };

    const errors = validateContactForm(
      payload,
      phoneCountry,
      phoneNational,
      validationMessages
    );

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("idle");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const result = await submitInquiry(payload);
      setStatus("success");
      setTicketNumber(result.ticketNumber);
      setFeedback(t("successMessage", { ticket: result.ticketNumber }));
      setFields(initialFields);
      setPhoneNational("");
      setPhoneCountry("NO");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error ? error.message : t("errorMessage")
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex w-full min-w-0 max-w-[1000px] flex-col gap-5 rounded-2xl border border-card-border bg-card-bg p-4 shadow-[inset_0px_-4px_100px_21px_rgba(24,25,51,0.2)] sm:gap-6 sm:rounded-[24px] sm:p-6 md:gap-[30px] md:p-8 lg:p-[30px]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 md:gap-[20px]">
        <FormField
          id="firstName"
          label={t("firstName")}
          placeholder={t("firstNamePlaceholder")}
          value={fields.firstName}
          onChange={updateField("firstName")}
          error={fieldErrors.firstName}
        />
        <FormField
          id="lastName"
          label={t("lastName")}
          placeholder={t("lastNamePlaceholder")}
          value={fields.lastName}
          onChange={updateField("lastName")}
          error={fieldErrors.lastName}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 md:gap-[20px]">
        <FormField
          id="email"
          label={t("email")}
          placeholder={t("emailPlaceholder")}
          value={fields.email}
          onChange={updateField("email")}
          type="email"
          error={fieldErrors.email}
        />
        <PhoneField
          id="phone"
          label={t("phone")}
          placeholder={t("phonePlaceholder")}
          country={phoneCountry}
          nationalNumber={phoneNational}
          error={fieldErrors.phone}
          onCountryChange={handlePhoneCountryChange}
          onNationalNumberChange={handlePhoneNationalChange}
        />
      </div>

      <FormField
        id="message"
        label={t("message")}
        placeholder={t("messagePlaceholder")}
        value={fields.message}
        onChange={updateField("message")}
        multiline
        error={fieldErrors.message}
      />
      {feedback ? (
        <p
          role="status"
          className={`text-sm sm:text-base ${
            status === "success" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {feedback}
          {status === "success" && ticketNumber ? (
            <span className="mt-1 block font-medium text-white">
              {t("ticketLabel", { ticket: ticketNumber })}
            </span>
          ) : null}
        </p>
      ) : null}
      <CtaFlowButton
        type="submit"
        label={status === "submitting" ? t("submitting") : t("submit")}
        disabled={status === "submitting"}
        arrowClassName="h-4 w-4 sm:h-5 sm:w-5"
        className="inline-flex cursor-pointer w-full items-center justify-center gap-1.5 rounded-full bg-[#ED1F24] px-5 py-3 text-base font-medium text-white shadow-control-inset shadow-[0_4px_14px_rgba(237,31,36,0.35)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit sm:px-6 sm:py-3.5 sm:text-lg"
      />
    </form>
  );
}
