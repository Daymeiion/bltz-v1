import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";

    let query = supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, full_name, avatar_url),
        recipient:profiles!messages_recipient_id_fkey(id, username, full_name, avatar_url),
        thread:message_threads(id, subject),
        attachments:message_attachments(id, file_name, file_path, thumbnail_path, file_size, file_type, width, height)
      `)
      .order("created_at", { ascending: false });

    // Filter by status
    if (status !== "all") {
      query = query.eq("status", status);
    }

    // Search functionality
    if (search) {
      query = query.or(`subject.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: messages, error, count } = await query;

    if (error) {
      console.error("Error fetching messages:", error);
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
    console.error("Error in messages GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { recipient_id, subject, content, priority = "normal", message_type = "admin_to_user" } = body;

    if (!recipient_id || !subject || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    // Create message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        sender_id: profile.id,
        recipient_id,
        subject,
        content,
        priority,
        message_type,
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
    console.error("Error in messages POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
