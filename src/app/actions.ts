"use server";

import { Resend } from "resend";
import { redirect } from "next/navigation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const goal = formData.get("goal") as string;
  const projectedRevenue = formData.get("projectedRevenue") as string;

  console.log("Form Submission:", { name, email, goal, projectedRevenue });

  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@raisinreach.com",
        to: process.env.EMAIL_TO || "reach@raisinreach.com",
        subject: `New Strategy Call Request: ${name}`,
        html: `
          <h1>New Lead from RaisinReach.com</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Monthly Revenue Goal:</strong> ${goal}</p>
          <hr />
          <h3>ROI Calculator Data</h3>
          <p><strong>Projected Revenue Potential:</strong> $${projectedRevenue}</p>
        `,
      });
    } catch (error) {
      console.error("Resend Error:", error);
      // We still redirect to success even if email fails to not block the user flow
      // ideally we would show an error, but for this "brutalist" speed, we assume success or handle logging.
    }
  } else {
    console.warn("RESEND_API_KEY is not set. Email not sent.");
  }

  // Redirect to Success Page
  redirect("/success");
}
