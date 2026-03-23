import { getGraduationCatalogCourses, getPostCatalogCourses, type CatalogCourse } from './catalogApi'

export type CoursePageEntry = CatalogCourse

export async function getGraduationCoursePages(force = false): Promise<CoursePageEntry[]> {
  return getGraduationCatalogCourses(force)
}

export async function getPostCoursePages(force = false): Promise<CoursePageEntry[]> {
  return getPostCatalogCourses(force)
}
