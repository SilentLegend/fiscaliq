'use client';

import { useState } from 'react';
import { verifyDatabase } from '../../lib/db-verify';

export default function TestDatabasePage() {
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleTest() {
***REMOVED***setLoading(true);
***REMOVED***try {
***REMOVED***  const verifyResults = await verifyDatabase();
***REMOVED***  setResults(verifyResults);
***REMOVED***  console.log('Verification complete:', verifyResults);
***REMOVED***} catch (error) {
***REMOVED***  console.error('Test failed:', error);
***REMOVED***  alert('Test failed, check console');
***REMOVED***}
***REMOVED***setLoading(false);
  }

  return (
***REMOVED***<div className="p-8 max-w-4xl mx-auto">
***REMOVED***  <h1 className="text-2xl font-bold mb-4">Database Verification Test</h1>
***REMOVED***  
***REMOVED***  <button
***REMOVED******REMOVED***onClick={handleTest}
***REMOVED******REMOVED***disabled={loading}
***REMOVED******REMOVED***className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
***REMOVED***  >
***REMOVED******REMOVED***{loading ? 'Testing...' : 'Run Database Test'}
***REMOVED***  </button>

***REMOVED***  {results && (
***REMOVED******REMOVED***<div className="mt-8">
***REMOVED******REMOVED***  <h2 className="text-xl font-bold mb-4">Results</h2>
***REMOVED******REMOVED***  <div className="space-y-4">
***REMOVED******REMOVED******REMOVED***{results.map((result) => (
***REMOVED******REMOVED******REMOVED***  <div key={result.table} className="border p-4 rounded">
***REMOVED******REMOVED******REMOVED******REMOVED***<h3 className="font-bold text-lg">{result.table}</h3>
***REMOVED******REMOVED******REMOVED******REMOVED***<ul className="mt-2 space-y-1 text-sm">
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ Exists: {result.exists ? 'Yes' : 'No'}</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ Rows: {result.rowCount}</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ SELECT: {result.testSelect ? '✅' : '❌'}</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ INSERT: {result.testInsert ? '✅' : '❌'}</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ UPDATE: {result.testUpdate ? '✅' : '❌'}</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ DELETE: {result.testDelete ? '✅' : '❌'}</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ RLS: {result.rlsEnabled ? 'Enabled' : 'Disabled'}</li>
***REMOVED******REMOVED******REMOVED******REMOVED***</ul>
***REMOVED******REMOVED******REMOVED******REMOVED***{result.errors.length > 0 && (
***REMOVED******REMOVED******REMOVED******REMOVED***  <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<strong>Errors:</strong>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ul className="mt-1">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {result.errors.map((err: string, i: number) => (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<li key={i}>- {err}</li>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</ul>
***REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  )}

***REMOVED***  <div className="mt-8 p-4 bg-blue-50 rounded">
***REMOVED******REMOVED***<p className="text-sm text-blue-700">
***REMOVED******REMOVED***  <strong>Note:</strong> This test performs INSERT, UPDATE, and DELETE operations on test records.
***REMOVED******REMOVED***  All test records are cleaned up automatically after the test completes.
***REMOVED******REMOVED***</p>
***REMOVED***  </div>
***REMOVED***</div>
  );
}
