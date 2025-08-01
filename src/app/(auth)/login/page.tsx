"use client";
import { auth } from "@/Firebase";
import { RecaptchaVerifier } from "firebase/auth";
import React, { useEffect, useState } from "react";

function page() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, // ✅ first
        "recaptcha-container", // ✅ second
        {
          size: "normal",
          callback: (response: any) => {
            console.log("reCAPTCHA solved", response);
          },
        }
      );
    }
  }, [auth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  return (
    <div>
      {!otpSent && <div id="recaptcha-container" className="w-full"></div>}
      <input
        type="tel"
        value={phone}
        placeholder="Enter Phone Number with Country Code"
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:border-blue-500"
      />
    </div>
  );
}

export default page;
