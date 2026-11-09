import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateSiCraftKey(seed: string): string {
  const clean = (seed || "PRO").toUpperCase().replace(/[^A-Z0-9]/g, "");
  let h1 = 0x811c9dc5;
  for (let i = 0; i < clean.length; i++) {
    h1 ^= clean.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193) >>> 0;
  }
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = (n: number) => {
    let s = "";
    let v = n >>> 0;
    for (let i = 0; i < 4; i++) {
      s += alphabet[Math.abs(v) % alphabet.length];
      v = (Math.floor(Math.abs(v) / alphabet.length) ^ (v << 3)) >>> 0;
    }
    return s;
  };
  const b1 = block(h1);
  const b2 = block(h1 ^ 0x5f3759df);
  const b3 = block(h1 ^ 0x9e3779b9);
  const combined = b1 + b2 + b3;
  let chk = 0;
  for (let i = 0; i < combined.length; i++) chk = (chk + combined.charCodeAt(i) * (i + 1)) % 9999;
  return `ACPRO-${b1}-${b2}-${b3}-${String(chk).padStart(4, "0")}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("CRYPTO_PAY_API_TOKEN");
    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: "CRYPTO_PAY_API_TOKEN not configured in Supabase secrets" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const body = await req.json();

    if (body.action === "create_invoice") {
      const parsedAmount = parseFloat(String(body.amount || "4.99").replace(/[^0-9.]/g, ""));
      const validAmount = !isNaN(parsedAmount) && parsedAmount >= 1 ? parsedAmount.toFixed(2) : "4.99";
      const tierId = String(body.tier || "silver");
      const uniqueSeed = `INV-${tierId.toUpperCase()}-${Date.now()}`;
      const generatedKey = generateSiCraftKey(uniqueSeed);

      const customDesc =
        typeof body.description === "string" && body.description.trim().length > 0
          ? body.description.trim()
          : `☕️ Alchemy Craft Pro (${validAmount} USD) — Tactile Swiss Bento Studio, Equalizer, Midnight Dark & Graph`;

      const cbRes = await fetch("https://pay.crypt.bot/api/createInvoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Crypto-Pay-API-Token": token,
        },
        body: JSON.stringify({
          currency_type: "fiat",
          fiat: "USD",
          amount: validAmount,
          accepted_assets: "USDT,TON,USDC,SOL,BNB,ETH,BTC,TRX",
          description: customDesc,
          hidden_message: `🎉 Спасибо за поддержку! Ваш персональный Pro-ключ: ${generatedKey} (Скопируйте и вставьте в настройки плагина Alchemy Craft в Obsidian)`,
          paid_btn_name: "callback",
          paid_btn_url: "https://t.me/StratAlchemy",
          payload: generatedKey,
          allow_comments: true,
          allow_anonymous: true,
          expires_in: 3600,
        }),
      });

      const data = await cbRes.json();
      if (data.ok && data.result) {
        return new Response(
          JSON.stringify({
            ok: true,
            invoice_id: data.result.invoice_id,
            amount: validAmount,
            license_key: generatedKey,
            pay_url: data.result.bot_invoice_url || data.result.pay_url,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ ok: false, error: data.error || "CryptoBot API error" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "check_invoice" && body.invoice_id) {
      const cbRes = await fetch(
        `https://pay.crypt.bot/api/getInvoices?invoice_ids=${encodeURIComponent(body.invoice_id)}`,
        {
          method: "GET",
          headers: { "Crypto-Pay-API-Token": token },
        }
      );
      const data = await cbRes.json();
      const items = data?.result?.items || [];
      const paidInv = items.find((inv: any) => inv.status === "paid");
      if (paidInv) {
        const key = paidInv.payload || generateSiCraftKey(String(paidInv.invoice_id));
        return new Response(
          JSON.stringify({ ok: true, paid: true, license_key: key, amount: paidInv.amount }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ ok: true, paid: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ ok: false, error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
