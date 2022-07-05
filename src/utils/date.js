const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
]

export const getDate = (dateString) => {
    const date = new Date(dateString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const day = date.getDay()
    const dayName = days[date.getDay()]
    const monthName = months[date.getMonth()]
    const year = date.getFullYear()
    const time = date.getTime()
    return `${dayName}, ${day}. ${monthName} ${year} - ${hours}:${minutes}`
}

export function isStudyActive(study) {
    if (study && study.startDate && study.endDate && study.is_active) {
        const currentDate = new Date().getTime();
        const studyStartDate = new Date(study.startDate).getTime();
        const studyEndDate = new Date(study.endDate).getTime();
        return currentDate >= studyStartDate && currentDate <= studyEndDate;
    }
    return false;
}
