import { chapterFolderId, isFolderHidden, type ChapterSetting, type CourseSetting, type Lesson, visibleLessons } from './visibility';
import { contentTypeIcon, contentTypes, type ContentType } from './content-types';
import { siteUrl } from './site-url';

export type CourseTreeNode = { key: string; label: string; href: string; order: number; type?: ContentType; summary?: string; children: CourseTreeNode[] };

function prefixOrder(value: string) {
  const match = value.match(/^(\d+)-/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function sortLessons(lessons: Lesson[]) {
  return [...lessons].sort((a, b) => {
    const aParts = a.id.split('/');
    const bParts = b.id.split('/');
    const aFolder = aParts.slice(0, -1).join('/');
    const bFolder = bParts.slice(0, -1).join('/');
    if (aFolder !== bFolder) return aFolder.localeCompare(bFolder, 'zh-Hant');
    const aOrder = a.data.order || prefixOrder(aParts.at(-1)!);
    const bOrder = b.data.order || prefixOrder(bParts.at(-1)!);
    return aOrder - bOrder || aParts.at(-1)!.localeCompare(bParts.at(-1)!, 'zh-Hant');
  });
}

export function buildCourseTree(
  lessons: Lesson[],
  courseRoot: string,
  courseSettings: CourseSetting[],
  chapterSettings: ChapterSetting[],
) {
  const roots: CourseTreeNode[] = [];
  const settingsByFolder = new Map(chapterSettings.map((setting) => [chapterFolderId(setting.id), setting]));

  function addFolder(folderId: string) {
    const parts = folderId.split('/');
    if (parts[0] !== courseRoot || isFolderHidden(folderId, courseSettings, chapterSettings)) return;
    let siblings = roots;
    for (let index = 1; index < parts.length; index += 1) {
      const fullFolderId = parts.slice(0, index + 1).join('/');
      const setting = settingsByFolder.get(fullFolderId);
      let branch = siblings.find((node) => node.key === fullFolderId);
      if (!branch) {
        const segment = parts[index];
        branch = {
          key: fullFolderId,
          label: setting?.data.title ?? segment.replace(/^\d+-/, ''),
          href: siteUrl(`/courses/${fullFolderId}/`),
          order: setting?.data.order || prefixOrder(segment),
          children: [],
        };
        siblings.push(branch);
      }
      siblings = branch.children;
    }
  }

  for (const setting of chapterSettings) {
    addFolder(chapterFolderId(setting.id));
  }

  for (const lesson of sortLessons(visibleLessons(lessons, courseSettings, chapterSettings))) {
    const parts = lesson.id.split('/');
    if (parts[0] !== courseRoot) continue;
    const parentFolderId = parts.slice(0, -1).join('/');
    if (parts.length > 2) addFolder(parentFolderId);
    let siblings = roots;
    for (let index = 1; index < parts.length - 1; index += 1) {
      const key = parts.slice(0, index + 1).join('/');
      const branch = siblings.find((node) => node.key === key);
      if (!branch) break;
      siblings = branch.children;
    }
    siblings.push({
      key: lesson.id,
      label: lesson.data.title,
      type: lesson.data.type,
      summary: lesson.data.summary,
      href: siteUrl(`/courses/${lesson.id}/`),
      order: lesson.data.order || prefixOrder(parts.at(-1)!),
      children: [],
    });
  }
  return roots;
}

export function chapterNodes(nodes: CourseTreeNode[]): CourseTreeNode[] {
  return nodes.filter(node => !node.type).flatMap(node => [node, ...chapterNodes(node.children)]);
}

export function countChapterLessons(node: CourseTreeNode): number {
  return node.type ? 1 : node.children.reduce((count, child) => count + countChapterLessons(child), 0);
}

export function sortedTreeNodes(nodes: CourseTreeNode[]) {
  return [...nodes].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'zh-Hant'));
}

/** Follow the same chapter and lesson order as the sidebar, including nested sections. */
export function orderedLessonNodes(nodes: CourseTreeNode[]): CourseTreeNode[] {
  return sortedTreeNodes(nodes).flatMap(node => node.type ? [node] : orderedLessonNodes(node.children));
}

export function renderCourseTree(nodes: CourseTreeNode[], currentHref?: string, depth = 0): string {
  const sorted = [...nodes].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'zh-Hant'));
  if (!sorted.length) return '';
  return `<ul>${sorted.map((node) => {
    const label = escapeHtml(node.label);
    if (node.type) {
      const active = node.href === currentHref;
      return `<li class="tree-page"><a class="tree-lesson content-kind-${node.type}" href="${escapeHtml(node.href)}"${active ? ' aria-current="page"' : ''}><span class="tree-type-icon" title="${contentTypes[node.type].label}">${contentTypeIcon(node.type)}</span><span>${label}</span></a></li>`;
    }
    const open = depth === 0 || currentHref?.startsWith(node.href) ? ' open' : '';
    const active = currentHref === node.href;
    return `<li class="tree-branch"><details${open}><summary><a class="tree-chapter-link" href="${escapeHtml(node.href)}"${active ? ' aria-current="page"' : ''}>${label}</a></summary>${renderCourseTree(node.children, currentHref, depth + 1)}</details></li>`;
  }).join('')}</ul>`;
}
