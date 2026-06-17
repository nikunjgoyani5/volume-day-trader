export default function AuthGradientLayer() {
  return (
    <div className="auth-gradient-layer" aria-hidden>
      <div className="auth-horns-container">
        <div className="auth-horn auth-horn-left" />
        <div className="auth-horn auth-horn-right" />
      </div>

      <div className="auth-vignette auth-vignette--top" />
      <div className="auth-vignette auth-vignette--bottom" />
      <div className="auth-vignette auth-vignette--center" />
    </div>
  );
}
