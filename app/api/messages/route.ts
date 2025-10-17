import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unread_only = searchParams.get("unread_only") === "true";

    let query = supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, full_name, avatar_url),
        recipient:profiles!messages_recipient_id_fkey(id, username, full_name, avatar_url),
        thread:message_threads(id, subject),
        attachments:message_attachments(id, file_name, file_path, thumbnail_path, file_size, file_type, width, height)
      `)
      .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
      .order("created_at", { ascending: false });

    // Filter for unread messages only
    if (unread_only) {
      query = query.eq("is_read", false);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: messages, error, count } = await query;

    if (error) {
      console.error("Error fetching user messages:", error);
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    return NextResponse.json({
      messages: messages || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error("Error in user messages GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recipient_id, subject, content, priority = "normal" } = body;

    if (!subject || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    let finalRecipientId = recipient_id;
    let messageType = "user_to_admin";

    // If no recipient specified, send to admin
    if (!recipient_id) {
      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .limit(1)
        .single();

      if (!adminProfile) {
        return NextResponse.json({ error: "No admin found" }, { status: 404 });
      }

      finalRecipientId = adminProfile.id;
      messageType = "user_to_admin";
    } else {
      // Check if recipient is valid and determine message type
      const { data: recipientProfile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", recipient_id)
        .single();

      if (!recipientProfile) {
        return NextResponse.json({ error: "Invalid recipient" }, { status: 400 });
      }

      messageType = recipientProfile.role === 'admin' ? "user_to_admin" : "user_to_user";
    }

    // Create message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        sender_id: profile.id,
        recipient_id: finalRecipientId,
        subject,
        content,
        priority,
        message_type: messageType,
        status: "sent"
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, full_name, avatar_url),
        recipient:profiles!messages_recipient_id_fkey(id, username, full_name, avatar_url)
      `)
      .single();

    if (messageError) {
      console.error("Error creating message:", messageError);
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error in user messages POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
