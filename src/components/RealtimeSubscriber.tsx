"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RealtimeSubscriber() {
  const router = useRouter();

  useEffect(() => {
    // Subscribe to any insert, update, or delete on the Zynteq tables
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public'
        },
        (payload) => {
          console.log('Real-time database change detected:', payload);
          // Tell Next.js to re-fetch the server components seamlessly in the background
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null; // This component doesn't render anything visually
}
