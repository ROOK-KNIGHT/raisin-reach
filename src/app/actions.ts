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
        subject: `🔥 New Lead: ${name} ($${projectedRevenue} Potential)`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="background-color: #F5F5F0; font-family: sans-serif; padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #3E1F47; box-shadow: 8px 8px 0px 0px #D4AF37;">
                
                <!-- Header -->
                <div style="background-color: #3E1F47; padding: 20px; text-align: center;">
                  <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">
                    Raisin Reach
                  </h1>
                </div>

                <!-- Content -->
                <div style="padding: 30px; color: #333333;">
                  <h2 style="color: #3E1F47; margin-top: 0;">New Strategy Call Request</h2>
                  <p style="font-size: 16px; line-height: 1.5;">
                    You have a new high-intent lead from the website.
                  </p>

                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Name</td>
                      <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
                      <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        <a href="mailto:${email}" style="color: #3E1F47;">${email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Revenue Goal</td>
                      <td style="padding: 10px; border-bottom: 1px solid #eee;">${goal}</td>
                    </tr>
                  </table>

                  <div style="background-color: #F5F5F0; padding: 20px; border-left: 4px solid #D4AF37; margin-top: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #3E1F47; font-size: 14px; text-transform: uppercase;">
                      ROI Calculator Data
                    </h3>
                    <p style="margin: 0; font-size: 20px; font-weight: bold; color: #3E1F47; font-family: monospace;">
                      Potential Revenue: $${projectedRevenue}
                    </p>
                  </div>

                  <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
                    This lead was captured via RaisinReach.com
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (error) {
      console.error("Resend Error:", error);
    }
  } else {
    console.warn("RESEND_API_KEY is not set. Email not sent.");
  }

  redirect("/success");
}
