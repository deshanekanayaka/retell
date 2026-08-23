import { createClient } from "./server";

export async function requireSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No authenticated session");
  }

  return { supabase, userId: user.id };
}
