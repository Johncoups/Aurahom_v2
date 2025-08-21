import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/openai';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing OpenAI API...');
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OPENAI_API_KEY not found in environment variables',
        available: false 
      }, { status: 500 });
    }

    // Test with a simple prompt
    const testPrompt = "Say 'Hello from OpenAI' in one sentence.";
    console.log('Sending test prompt:', testPrompt);
    
    const response = await generateText(testPrompt);
    console.log('OpenAI response:', response);
    
    return NextResponse.json({ 
      success: true, 
      response,
      available: true 
    });
    
  } catch (error) {
    console.error('OpenAI test failed:', error);
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      available: false 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Processing custom prompt...');
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OPENAI_API_KEY not found in environment variables',
        available: false 
      }, { status: 500 });
    }

    const body = await request.json();
    const { prompt } = body;
    
    if (!prompt) {
      return NextResponse.json({ 
        error: 'No prompt provided in request body',
        available: false 
      }, { status: 400 });
    }

    console.log('Sending custom prompt:', prompt);
    
    const response = await generateText(prompt, 'gpt-4o-mini', { temperature: 0.3 });
    console.log('OpenAI response received');
    
    return NextResponse.json({ 
      success: true, 
      response,
      available: true 
    });
    
  } catch (error) {
    console.error('Custom prompt processing failed:', error);
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      available: false 
    }, { status: 500 });
  }
}
