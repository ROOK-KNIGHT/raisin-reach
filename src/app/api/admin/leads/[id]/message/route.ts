import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;

    // Only admin roles can send messages
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: leadId } = await params;
    const { subject, message, cc, bcc } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Get lead details
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        companyName: true,
        contactName: true,
        contactEmail: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (!lead.contactEmail) {
      return NextResponse.json(
        { error: "Lead has no email address" },
        { status: 400 }
      );
    }

    // Parse CC and BCC emails
    const ccEmails = cc
      ? cc
          .split(",")
          .map((email: string) => email.trim())
          .filter((email: string) => email.length > 0)
      : [];

    const bccEmails = bcc
      ? bcc
          .split(",")
          .map((email: string) => email.trim())
          .filter((email: string) => email.length > 0)
      : [];

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Raisin Reach <noreply@raisinreach.com>",
      to: [lead.contactEmail],
      ...(ccEmails.length > 0 && { cc: ccEmails }),
      ...(bccEmails.length > 0 && { bcc: bccEmails }),
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #4A1D4A; color: #F5F1E8; padding: 30px; text-align: center; border-bottom: 4px solid #D4AF37;">
              <h1 style="margin: 0; font-size: 28px; text-transform: uppercase;">Raisin Reach</h1>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border: 2px solid #4A1D4A;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Hello ${lead.contactName},
              </p>
              
              <div style="white-space: pre-wrap; font-size: 15px; line-height: 1.8;">
                ${message}
              </div>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 14px; color: #666; margin: 0;">
                  Best regards,<br>
                  <strong>The Raisin Reach Team</strong>
                </p>
              </div>
            </div>
            
            <div style="background-color: #F5F1E8; padding: 20px; text-align: center; border-top: 2px solid #4A1D4A; margin-top: 0;">
              <p style="font-size: 12px; color: #666; margin: 0;">
                © ${new Date().getFullYear()} Raisin Reach. All rights reserved.
              </p>
              <p style="font-size: 12px; color: #666; margin: 10px 0 0 0;">
                <a href="https://raisinreach.com" style="color: #4A1D4A; text-decoration: none;">Visit our website</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Email sent successfully",
      emailId: data?.id,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
