import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_STORAGE_REPO!;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

const ghHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
};

interface TreeItem {
  path: string;
  type: string;
  sha: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. List every file in the repo in one call
    const treeRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`,
      { headers: ghHeaders }
    );

    if (!treeRes.ok) {
      const errText = await treeRes.text();
      console.error('Tree fetch failed:', treeRes.status, errText);
      return res.status(500).json({ error: 'Failed to list files' });
    }

    const treeData = await treeRes.json();

    const files: TreeItem[] = (treeData.tree || []).filter(
      (item: TreeItem) =>
        item.type === 'blob' &&
        (item.path.startsWith('drawings/') || item.path.startsWith('messages/'))
    );

    // Newest first - filenames are date-based, so plain string sort works
    files.sort((a, b) => (a.path < b.path ? 1 : -1));

    // 2. Fetch every file's actual bytes via the Git Blobs API (auth'd, works on private repos)
    const items = await Promise.all(
      files.map(async (f) => {
        const isDrawing = f.path.startsWith('drawings/');
        const filename = f.path.split('/').pop() || '';
        const timestamp = filename.replace(/\.(png|txt)$/, '');

        const blobRes = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs/${f.sha}`,
          { headers: ghHeaders }
        );

        if (!blobRes.ok) {
          console.error(`Blob fetch failed for ${f.path}:`, blobRes.status);
          return {
            path: f.path,
            type: isDrawing ? ('drawing' as const) : ('message' as const),
            timestamp,
            error: true,
          };
        }

        const blobData = await blobRes.json();
        const base64Content = (blobData.content || '').replace(/\n/g, '');

        if (isDrawing) {
          return {
            path: f.path,
            type: 'drawing' as const,
            timestamp,
            dataUrl: `data:image/png;base64,${base64Content}`,
          };
        }

        const textContent = Buffer.from(base64Content, 'base64').toString('utf-8');
        return {
          path: f.path,
          type: 'message' as const,
          timestamp,
          textContent,
        };
      })
    );

    return res.status(200).json({ items });

  } catch (error) {
    console.error('Error building gallery data:', error);
    return res.status(500).json({ error: 'Failed to load gallery' });
  }
}
