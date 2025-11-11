export type CourseType = {
    id: number
    title: string
    studentsCount: number
}
export const db: DBtype = {
    courses: [{id: 1, title: 'front-end', studentsCount: 10},
        {id: 2, title: 'beck-end', studentsCount: 10},
        {id: 3, title: 'automation qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10}]
}
export type DBtype = { courses: CourseType[] }