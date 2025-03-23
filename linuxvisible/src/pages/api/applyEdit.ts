import type { NextApiRequest, NextApiResponse } from 'next';
import { baseUrl } from '../../utils/urlConfig';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { entities, version, repoPath } = req.body;

  if (!version || !repoPath) {
    return res.status(400).json({ message: 'Missing version or repoPath parameter' });
  }

  try {
    const response = await fetch(`${baseUrl}/kg/editGraph?version=${version}&repoPath=${repoPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entities),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 