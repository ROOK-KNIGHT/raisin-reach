import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/knowledge');

export interface KnowledgePost {
  slug: string;
  title: string;
  description: string;
  ai_summary: string;
  structured_data: any;
  content: string;
}

export function getAllKnowledgePosts(): KnowledgePost[] {
  const fileNames = fs.readdirSync(contentDirectory);
  return fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      description: data.description,
      ai_summary: data.ai_summary,
      structured_data: data.structured_data,
      content,
    };
  });
}

export function getKnowledgePost(slug: string): KnowledgePost | null {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    description: data.description,
    ai_summary: data.ai_summary,
    structured_data: data.structured_data,
    content,
  };
}
