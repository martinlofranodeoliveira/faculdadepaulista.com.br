import {
  getGraduationCatalogCourseBySlug,
  getGraduationCatalogCourses,
  getGraduationCatalogCourseSummaries,
  getPostCatalogCourseBySlug,
  getPostCatalogCourses,
  getPostCatalogCourseSummaries,
  type CatalogCourse,
  type CatalogCourseSummary,
} from './catalogApi'

export type CoursePageEntry = CatalogCourse
export type CoursePageSummaryEntry = CatalogCourseSummary

export async function getGraduationCoursePages(force = false): Promise<CoursePageEntry[]> {
  return getGraduationCatalogCourses(force)
}

export async function getPostCoursePages(force = false): Promise<CoursePageEntry[]> {
  return getPostCatalogCourses(force)
}

export async function getGraduationCoursePageBySlug(slug: string, force = false): Promise<CoursePageEntry | null> {
  return getGraduationCatalogCourseBySlug(slug, force)
}

export async function getPostCoursePageBySlug(slug: string, force = false): Promise<CoursePageEntry | null> {
  return getPostCatalogCourseBySlug(slug, force)
}

export async function getGraduationCoursePageSummaries(
  force = false,
): Promise<CoursePageSummaryEntry[]> {
  return getGraduationCatalogCourseSummaries(force)
}

export async function getPostCoursePageSummaries(force = false): Promise<CoursePageSummaryEntry[]> {
  return getPostCatalogCourseSummaries(force)
}
