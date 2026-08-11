import { NextResponse } from 'next/server';
import { getStandingDirective, triggerAgencySwarm, runIntentHunt } from '@/app/actions';

export async function GET(request: Request) {
  // Secure the route with Vercel's built-in CRON_SECRET
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const directive = await getStandingDirective();
    
    if (directive === "No standing directive set.") {
      return NextResponse.json({ message: "No directive set. Skipping background run." });
    }

    console.log("[Background Cron] Executing Autonomy Loop...");
    
    // We can just trigger the swarm, or mix it up. 
    // Trigger the master swarm action
    const result = await triggerAgencySwarm(directive);
    
    // Also run an intent hunt based on the core topic
    await runIntentHunt(directive);

    return NextResponse.json({ 
      success: true, 
      message: "Background swarm and intent hunt executed successfully.",
      details: result
    });
  } catch (error: any) {
    console.error("[Background Cron Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
