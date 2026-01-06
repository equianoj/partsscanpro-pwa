
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    return;
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  const imageBase64 = buffer.toString('base64');

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "text", text: "Identify this HVAC or plumbing part. Return JSON with part_name, confidence (0-1), specs, and where_to_buy." },
          { type: "input_image", image_url: `data:image/jpeg;base64,${imageBase64}` }
        ]
      }
    ],
    text: { format: { type: "json_object" } }
  });

  res.status(200).json(JSON.parse(response.output_text));
}
