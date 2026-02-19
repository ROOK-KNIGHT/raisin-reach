"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TwoFactorModal({ isOpen, onClose, onSuccess }: TwoFactorModalProps) {
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleSetup = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/portal/2fa/setup", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setStep("verify");
      } else {
        toast.error(data.error || "Failed to setup 2FA");
      }
    } catch (error) {
      console.error("2FA setup error:", error);
      toast.error("An error occurred while setting up 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/portal/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Two-factor authentication enabled successfully!");
        handleClose();
        onSuccess();
      } else {
        toast.error(data.error || "Invalid verification code");
      }
    } catch (error) {
      console.error("2FA verification error:", error);
      toast.error("An error occurred while verifying the code");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setStep("setup");
      setQrCode("");
      setSecret("");
      setVerificationCode("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-brand-plum max-w-lg w-full shadow-[4px_4px_0px_0px_var(--color-brand-plum)]">
        {/* Header */}
        <div className="bg-brand-plum text-brand-bone p-6 border-b-4 border-brand-gold">
          <h2 className="text-2xl font-display font-bold uppercase">Enable Two-Factor Authentication</h2>
          <p className="text-brand-bone/80 mt-1">Add an extra layer of security to your account</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "setup" && (
            <div className="space-y-6">
              <div className="bg-brand-bone p-4 border-l-4 border-brand-gold">
                <h3 className="font-bold text-brand-plum mb-2">What is 2FA?</h3>
                <p className="text-sm text-brand-charcoal/80">
                  Two-factor authentication adds an extra layer of security by requiring a code from your
                  authenticator app in addition to your password when signing in.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-brand-plum mb-2">You'll need:</h3>
                <ul className="space-y-2 text-sm text-brand-charcoal/80">
                  <li className="flex items-start">
                    <span className="text-brand-gold mr-2">▸</span>
                    <span>An authenticator app (Google Authenticator, Authy, 1Password, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-gold mr-2">▸</span>
                    <span>Your mobile device to scan the QR code</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetup}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Setting up..." : "Continue"}
                </button>
              </div>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-brand-plum mb-3">Step 1: Scan QR Code</h3>
                <p className="text-sm text-brand-charcoal/80 mb-4">
                  Open your authenticator app and scan this QR code:
                </p>
                {qrCode && (
                  <div className="flex justify-center p-4 bg-white border-2 border-brand-plum">
                    <Image src={qrCode} alt="2FA QR Code" width={200} height={200} />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-brand-plum mb-2">Step 2: Enter Verification Code</h3>
                <p className="text-sm text-brand-charcoal/80 mb-3">
                  Enter the 6-digit code from your authenticator app:
                </p>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-brand-plum/20 focus:border-brand-plum focus:outline-none font-mono text-2xl text-center tracking-widest"
                />
              </div>

              <div className="bg-brand-bone p-4 border-l-4 border-brand-gold">
                <p className="text-xs font-mono uppercase tracking-widest text-brand-charcoal/60 mb-1">
                  Manual Entry Code
                </p>
                <p className="text-sm font-mono text-brand-plum break-all">{secret}</p>
                <p className="text-xs text-brand-charcoal/60 mt-2">
                  If you can't scan the QR code, enter this code manually in your authenticator app.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-brand-plum text-brand-plum font-mono text-sm uppercase tracking-widest hover:bg-brand-plum/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 px-6 py-3 bg-brand-gold text-brand-plum font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-plum hover:text-brand-gold border-2 border-brand-plum transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify & Enable"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
