import { format, addHours } from 'date-fns'
import { es } from 'date-fns/locale'
//import { tz } from '@date-fns/tz'

const formatDate = (date, language) => {
  if (language === 'es') {
    return (
      format(date, 'eeee', { locale: es }).charAt(0).toUpperCase() +
      format(date, 'eeee', { locale: es }).slice(1)
    )
  }

  return format(date, 'eeee')
}

const isAMOrPM = (hour) => {
  return hour >= 12 ? 'PM' : 'AM'
}

const getSchedule = (date) => {
  const timedZoneDate = new Date(
    format(date, 'yyyy-MM-dd HH:mm:ss', {
      timeZone: 'America/Mexico_City'
    })
  )

  const startHour = timedZoneDate.getHours()
  const startMinutes = timedZoneDate.getMinutes()

  const finishSchedule = addHours(timedZoneDate, 1)

  const finishHour = finishSchedule.getHours()
  const finishMinutes = finishSchedule.getMinutes()

  return `${startHour.toString().padStart(2, '0')}:${startMinutes
    .toString()
    .padStart(2, '0')} ${isAMOrPM(startHour)} A ${finishHour
    .toString()
    .padStart(2, '0')}:${finishMinutes.toString().padStart(2, '0')} ${isAMOrPM(
    finishHour
  )}`
}

const formatSchedule = (hour) => {
  const [hourString, minutes] = hour.split(':')

  const finalHour = parseInt(hourString) + 1

  return `${hourString.padStart(2, '0')}:${minutes} A ${finalHour
    .toString()
    .padStart(2, '0')}:${minutes}`
}

const getLargeDate = (date) => {
  console.log('Date: ', date)

  const day = formatDate(new Date(date), 'es')
  const dayNumber = format(new Date(date), 'dd')

  const largeDate = `${day} ${format(new Date(date), 'dd')} de ${format(
    new Date(date),
    'MMMM',
    {
      locale: es
    }
  )} de ${format(new Date(date), 'yyyy')}`

  return largeDate
}

export { formatDate, getSchedule, isAMOrPM, formatSchedule, getLargeDate }
