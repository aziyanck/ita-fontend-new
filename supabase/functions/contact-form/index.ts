import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const submission = await req.json();
    const { name, email, phone, company, message } = submission;

    // 1. Insert into Supabase table
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );
    await supabaseClient.from("contact_submissions").insert(submission);

    // 2. Send email to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: Deno.env.get("ADMIN_EMAIL"), // pulled from secret
        pass: Deno.env.get("ADMIN_PASS"),  // pulled from secret
      },
    });

    const mailOptions = {
      from: Deno.env.get("ADMIN_EMAIL"),
      to: Deno.env.get("ADMIN_EMAIL"),
      subject: "New Contact Form Submission",
      text: `
📩 New Contact Form Submission

🧑 Name: ${name}
🏢 Company: ${company || "Not Provided"}
📧 Email: ${email}
📱 Phone: ${phone}
📝 Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: "Registration successful." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});