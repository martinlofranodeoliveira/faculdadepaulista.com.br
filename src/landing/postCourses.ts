const POS_COURSES_ENDPOINT =
  import.meta.env.VITE_POS_COURSES_ENDPOINT ??
  '/fasul-courses-api/rotinas/cursos-ia-format-texto-2025-unicesp.php'

let postCoursesRequest: Promise<string> | null = null

async function requestPostCoursesRaw(): Promise<string> {
  const response = await fetch(POS_COURSES_ENDPOINT, {
    method: 'GET',
    headers: {
      Accept: 'text/plain, */*',
    },
  })

  if (!response.ok) {
    throw new Error(`Post courses request failed with status ${response.status}`)
  }

  return response.text()
}

export function fetchPostCoursesRaw(force = false): Promise<string> {
  if (force || !postCoursesRequest) {
    postCoursesRequest = requestPostCoursesRaw().catch((error) => {
      postCoursesRequest = null
      throw error
    })
  }

  return postCoursesRequest
}
