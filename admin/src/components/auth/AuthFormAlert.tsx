type AuthFormAlertProps = {
  message: string;
};

export default function AuthFormAlert({ message }: AuthFormAlertProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-tab-active/40 bg-tab-active/10 px-4 py-3 text-sm leading-relaxed text-tertiary-text"
    >
      {message}
    </div>
  );
}
