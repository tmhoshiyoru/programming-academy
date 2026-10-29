import type { CollectionEntry } from 'astro:content';

export type Lesson = CollectionEntry<'lessons'>;
export type CourseSetting = CollectionEntry<'courseSettings'>;
export type ChapterSetting = CollectionEntry<'chapterSettings'>;

export function courseFolderId(settingId: string) {
  return settingId.replace(/(?:^|\/)\_course$/, '').replace(/\\/g, '/');
}

export function chapterFolderId(settingId: string) {
  return settingId.replace(/(?:^|\/)\_chapter$/, '').replace(/\\/g, '/');
}

function courseSettingsByFolder(settings: CourseSetting[]) {
  return new Map(settings.map((setting) => [courseFolderId(setting.id), setting]));
}

function chapterSettingsByFolder(settings: ChapterSetting[]) {
  return new Map(settings.map((setting) => [chapterFolderId(setting.id), setting]));
}

export function isCourseHidden(courseId: string, settings: CourseSetting[]) {
  return courseSettingsByFolder(settings).get(courseId)?.data.hidden ?? false;
}

export function isFolderHidden(folderId: string, courseSettings: CourseSetting[], chapterSettings: ChapterSetting[]) {
  const parts = folderId.split('/');
  if (isCourseHidden(parts[0], courseSettings)) return true;
  const settingsByFolder = chapterSettingsByFolder(chapterSettings);
  for (let length = 2; length <= parts.length; length += 1) {
    if (settingsByFolder.get(parts.slice(0, length).join('/'))?.data.hidden) return true;
  }
  return false;
}

export function isLessonHidden(lesson: Lesson, courseSettings: CourseSetting[], chapterSettings: ChapterSetting[]) {
  if (lesson.data.hidden) return true;
  const parts = lesson.id.split('/');
  const courseId = parts[0];
  if (isCourseHidden(courseId, courseSettings)) return true;
  for (let length = 2; length < parts.length; length += 1) {
    if (isFolderHidden(parts.slice(0, length).join('/'), courseSettings, chapterSettings)) return true;
  }
  return false;
}

export function visibleLessons(lessons: Lesson[], courseSettings: CourseSetting[], chapterSettings: ChapterSetting[]) {
  return lessons.filter((lesson) => !lesson.data.draft && !isLessonHidden(lesson, courseSettings, chapterSettings));
}

export function visibleCourses(settings: CourseSetting[]) {
  return settings.filter((setting) => !setting.data.hidden).sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'zh-Hant'));
}
