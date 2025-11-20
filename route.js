// app/api/generate-ad/route.js
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt, tone, approvedAd, regenerate, switchTone } =
      await req.json();

    if (!prompt || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing prompt" }),
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // -------------------------------
    // 1) TEXT GENERATION PROMPT
    // -------------------------------
    const systemMessage = `
You are an expert Digital Ad Generator.

You produce:
1) High-converting marketing text
2) A full image-generation prompt
3) A clean JSON output

OUTPUT ONLY JSON:

{
  "type": "",
  "headline": "",
  "subheadline": "",
  "body": "",
  "visual_style": "",
  "design_layout": "",
  "image_prompt": "",
  "cta": "",
  "tagline": ""
}

Tone: ${tone || "professional"}

${
  approvedAd
    ? `Match this anchor style: ${JSON.stringify(approvedAd)}`
    : ""
}

${regenerate ? "Generate a fresh variation." : ""}
${switchTone ? "Rewrite using the new tone." : ""}
`;

    // -------------------------------
    // 2) ASK GPT FOR DIGITAL AD TEXT
    // -------------------------------
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
    });

    const raw = completion.choices[0].message.content;

    let ad;
    try {
      ad = JSON.parse(raw);
    } catch {
      // fallback if model produces almost JSON but slightly wrong
      ad = {
        type: "Digital Ad",
        headline: "Generated Ad",
        subheadline: "",
        body: raw,
        visual_style: "Bright, modern promotional style",
        design_layout: "Centered content",
        image_prompt:
          "Modern digital advertisement in bright clean studio lighting",
        cta: "",
        tagline: "",
      };
    }

    // -------------------------------
    // 3) IMAGE GENERATION STEP
    // -------------------------------
    const image = await client.images.generate({
      model: "gpt-image-1", // OpenAI image model
      prompt: ad.image_prompt,
      size: "1024x1024",
      quality: "high",
    });

    // Image is returned as a base64 string
    const imageBase64 = image.data[0].b64_json;

    // Convert to usable image URL
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    // -------------------------------
    // RETURN TEXT + IMAGE
    // -------------------------------
    return new Response(
      JSON.stringify({ ad, imageUrl }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("API ERROR:", err);
    return new Response(
      JSON.stringify({
        error: "Generation failed",
        details: err.toString(),
      }),
      { status: 500 }
    );
  }
}
