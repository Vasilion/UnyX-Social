import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirectTo = requestUrl.searchParams.get("redirect") || "/"

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    await supabase.auth.exchangeCodeForSession(code)

    // Check if user has a profile, if not create one
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (!profile) {
        // Create a profile for the user
        const username =
          session.user.user_metadata.username ||
          session.user.user_metadata.name ||
          session.user.user_metadata.full_name ||
          `user_${Math.floor(Math.random() * 1000000)}`

        await supabase.from("profiles").insert({
          id: session.user.id,
          username,
          avatar_url: session.user.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}

