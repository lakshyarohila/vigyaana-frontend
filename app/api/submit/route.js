import { Resend } from "resend";
import dotenv from 'dotenv'
dotenv.config();
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

// Named export for the POST method
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validate input fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
    }

    // Send email to yourself
    await resend.emails.send({
      from: "onboarding@resend.dev", // Replace with a verified sender email
      to: process.env.EMAIL_RECEIVER, // Your email address
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    // Send confirmation email to the user
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Thank You for Contacting Us!",
      text: `Hello ${name},\n\nWe've received your message and will get back to you soon!\n\nBest regards,\nYour Team.`,
    });

    return new Response(JSON.stringify({ message: "Message sent successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Error sending message." }), { status: 500 });
  }
}

// Handle other HTTP methods, if necessary, by adding more named exports
