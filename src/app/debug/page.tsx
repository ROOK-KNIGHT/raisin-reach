import fs from 'fs';
import path from 'path';

export default function DebugPage() {
  const cwd = process.cwd();
  let files: string[] = [];
  let error: string | null = null;

  try {
    const dir = path.join(cwd, 'src/content/knowledge');
    if (fs.existsSync(dir)) {
      files = fs.readdirSync(dir);
    } else {
      error = `Directory not found: ${dir}`;
    }
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="p-12 font-mono">
      <h1>Debug Info</h1>
      <p><strong>CWD:</strong> {cwd}</p>
      {error ? (
        <p className="text-red-500"><strong>Error:</strong> {error}</p>
      ) : (
        <div>
          <h2>Files in src/content/knowledge:</h2>
          <ul>
            {files.map(f => <li key={f}>{f}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
