// Search History & Saved Search API
// F039: Search History, F047: Saved Search
// Uses localStorage on client-side for anonymous users

import { NextRequest, NextResponse } from 'next/server';
import { SavedSearch, SearchHistoryItem } from '@/types/search';

// ==================== SEARCH HISTORY (F039) ====================

/**
 * GET: Retrieve search history for a user or anonymous session
 * GET /api/search/history?sessionId=xxx
 * Note: For now, search history is stored in localStorage on client-side
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Note: Search history is stored in localStorage on client-side
    // This endpoint can be extended to store history in MongoDB for authenticated users

    return NextResponse.json({
      history: [],
      message: 'Use client-side localStorage for anonymous users'
    });
  } catch (error) {
    console.error('Get search history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Save a search to history
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type, resultsCount, sessionId, userId } = body;

    // Note: Search history is stored in localStorage on client-side
    // This endpoint can be extended to store history in MongoDB for authenticated users

    return NextResponse.json({
      success: true,
      message: 'Search history saved to localStorage on client-side'
    });
  } catch (error) {
    console.error('Save search history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE: Clear search history
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    // Note: Search history is stored in localStorage on client-side

    return NextResponse.json({
      success: true,
      message: 'Search history cleared from localStorage on client-side'
    });
  } catch (error) {
    console.error('Clear search history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ==================== SAVED SEARCH (F047) ====================

/**
 * GET: Retrieve saved searches
 * GET /api/search/saved?userId=xxx
 */
export async function GET_SAVED_SEARCHES(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Return empty array - saved searches stored in localStorage on client-side
    return NextResponse.json({
      savedSearches: []
    });
  } catch (error) {
    console.error('Get saved searches error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Save a search
 * POST /api/search/saved
 */
export async function POST_SAVED_SEARCHES(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, params, userId } = body;

    // Return success - saved searches stored in localStorage on client-side
    return NextResponse.json({
      success: true,
      savedSearch: {
        id: Date.now().toString(),
        name,
        params,
        userId,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Save search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE: Delete a saved search
 * DELETE /api/search/saved?id=xxx
 */
export async function DELETE_SAVED_SEARCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    return NextResponse.json({
      success: true,
      message: 'Saved search deleted from localStorage on client-side'
    });
  } catch (error) {
    console.error('Delete saved search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
