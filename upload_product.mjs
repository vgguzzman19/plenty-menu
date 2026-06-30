import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const SUPABASE_URL = "https://mgqeswcsgdoopkvzekfm.supabase.co";
const SERVICE_KEY = "sb_secret_rOg_wshzldgKaDUgNCtJTg_ZuWQORsm";
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const [,, productId, localFile] = process.argv;

async function run() {
  const filename = `product_${productId}.png`;
  const fileBuffer = fs.readFileSync(localFile);

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filename, fileBuffer, { contentType: "image/png", upsert: true });

  if (uploadError) { console.error("Upload error:", uploadError.message); process.exit(1); }

  const { data } = supabase.storage.from("product-images").getPublicUrl(filename);

  const { error: updateError } = await supabase
    .from("products")
    .update({ image_url: data.publicUrl })
    .eq("id", parseInt(productId));

  if (updateError) { console.error("Update error:", updateError.message); process.exit(1); }

  console.log(`OK: product ${productId} → ${data.publicUrl}`);
}

run();
