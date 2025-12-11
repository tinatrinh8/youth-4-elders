export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: 'holiday' | 'school' | 'club'
  description?: string
}

// Generate recurring Technology Workshop events (every Friday for 6 weeks)
// Starts on September 16, 2025, occurs every Friday
const generateWorkshopDates = (): Date[] => {
  // Start from September 16, 2025 and find the first Friday on or after that date
  const startDate = new Date(2025, 8, 16) // September 16, 2025
  const dates: Date[] = []
  
  // Find the first Friday on or after September 16, 2025
  const currentDate = new Date(startDate)
  while (currentDate.getDay() !== 5) { // 5 = Friday
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Generate 6 Fridays
  for (let i = 0; i < 6; i++) {
    const friday = new Date(currentDate)
    friday.setDate(currentDate.getDate() + (i * 7))
    dates.push(friday)
  }
  
  return dates
}

const workshopDates = generateWorkshopDates()

// All events data
export const events: CalendarEvent[] = [
  // Technology Workshop Series - recurring every Friday for 6 weeks
  ...workshopDates.map((date, index) => ({
    id: `workshop-${index + 1}`,
    title: 'Technology Workshop',
    date: date,
    type: 'club' as const,
    description: 'A 6-week weekly workshop series teaching and helping with technology. Help elders with technology basics. Located at Glebe Centre Abbotsford.'
  })),
  // School Club Fair
  {
    id: 'club-fair',
    title: 'Club Fair',
    date: new Date(2025, 8, 3), // September 3, 2025
    type: 'club',
    description: 'Come find us at the Club Fair! This Wednesday, September 3rd, from 2:00-4:00 PM, swing by Table 16 in UCU (85 University Private). Come chat with our execs and find out why Y4E could be perfect for you!'
  },
  // Sips, Samples, Social
  {
    id: 'sips-samples',
    title: 'Sips, Samples, Social',
    date: new Date(2025, 10, 10), // November 10, 2025
    type: 'club',
    description: 'Sample delicious goodies from our favourite local vendors at Abbotsford Seniors Centre.'
  },
  // Spikeball Event (from countdown)
  {
    id: 'spikeball',
    title: 'Spikeball Event',
    date: new Date(2026, 0, 16), // January 16, 2026
    type: 'club',
    description: 'Join us for our fun Spikeball tournament!'
  },
  // School events
  {
    id: 'fall-term-starts',
    title: 'Fall Term Starts',
    date: new Date(2025, 8, 3), // September 3, 2025
    type: 'school',
    description: 'Course dates: September 3 to December 2, 2025.'
  },
  {
    id: 'fall-term-ends',
    title: 'Fall Term Ends',
    date: new Date(2025, 11, 2), // December 2, 2025
    type: 'school',
    description: 'End of fall term. Course dates: September 3 to December 2, 2025.'
  },
  // Fall Term 2026
  {
    id: 'fall-term-2026-starts',
    title: 'Fall Term Starts',
    date: new Date(2026, 8, 9), // September 9, 2026
    type: 'school',
    description: 'Course dates: September 9 to December 9, 2026.'
  },
  {
    id: 'fall-term-2026-ends',
    title: 'Fall Term Ends',
    date: new Date(2026, 11, 9), // December 9, 2026
    type: 'school',
    description: 'End of fall term. Course dates: September 9 to December 9, 2026.'
  },
  // Fall Reading Week 2025 - add event for each day
  ...Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2025, 9, 12 + i) // October 12-18, 2025
    return {
      id: `reading-week-fall-2025-${i + 1}`,
      title: 'Reading Week',
      date: date,
      type: 'school' as const,
      description: 'Reading Week: October 12 to 18, 2025. No classes for most faculties. No exams or assignments due.'
    }
  }),
  // Fall Reading Week 2026 - add event for each day
  ...Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2026, 9, 25 + i) // October 25-31, 2026
    return {
      id: `reading-week-fall-2026-${i + 1}`,
      title: 'Reading Week',
      date: date,
      type: 'school' as const,
      description: 'Reading Week: October 25 to 31, 2026. No classes for most faculties. No exams or assignments due.'
    }
  }),
  // Winter Reading Week 2026 - add event for each day
  ...Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2026, 1, 15 + i) // February 15-21, 2026
    return {
      id: `reading-week-winter-2026-${i + 1}`,
      title: 'Reading Week',
      date: date,
      type: 'school' as const,
      description: 'Reading Week: February 15 to 21, 2026. No classes for most faculties. No exams or assignments due.'
    }
  }),
  // Winter Reading Week 2027 - add event for each day
  ...Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2027, 1, 14 + i) // February 14-20, 2027
    return {
      id: `reading-week-winter-2027-${i + 1}`,
      title: 'Reading Week',
      date: date,
      type: 'school' as const,
      description: 'Reading Week: February 14 to 20, 2027. No classes for most faculties. No exams or assignments due.'
    }
  }),
  // Fall Exam Period 2025 - add event for each day
  ...Array.from({ length: 14 }, (_, i) => {
    const date = new Date(2025, 11, 4 + i) // December 4-17, 2025
    return {
      id: `exam-period-fall-2025-${i + 1}`,
      title: 'Exam Period',
      date: date,
      type: 'school' as const,
      description: 'Exams are scheduled during the week and on the weekend, both during the day and in the evening. December 4 to 17, 2025.'
    }
  }),
  // Fall Exam Period 2026 - add event for each day
  ...Array.from({ length: 13 }, (_, i) => {
    const date = new Date(2026, 11, 10 + i) // December 10-22, 2026
    return {
      id: `exam-period-fall-2026-${i + 1}`,
      title: 'Exam Period',
      date: date,
      type: 'school' as const,
      description: 'Exams are scheduled during the week and on the weekend, both during the day and in the evening. December 10 to 22, 2026.'
    }
  }),
  // Winter Exam Period 2026 - add event for each day
  ...Array.from({ length: 14 }, (_, i) => {
    const date = new Date(2026, 3, 17 + i) // April 17-30, 2026
    return {
      id: `exam-period-winter-2026-${i + 1}`,
      title: 'Exam Period',
      date: date,
      type: 'school' as const,
      description: 'Exams are scheduled during the week and on the weekend, both during the day and in the evening. April 17 to 30, 2026.'
    }
  }),
  // Winter Exam Period 2027 - add event for each day
  ...Array.from({ length: 14 }, (_, i) => {
    const date = new Date(2027, 3, 16 + i) // April 16-29, 2027
    return {
      id: `exam-period-winter-2027-${i + 1}`,
      title: 'Exam Period',
      date: date,
      type: 'school' as const,
      description: 'Exams are scheduled during the week and on the weekend, both during the day and in the evening. April 16 to 29, 2027.'
    }
  }),
  // Winter Term
  {
    id: 'winter-term-starts',
    title: 'Winter Term Starts',
    date: new Date(2026, 0, 12), // January 12, 2026
    type: 'school',
    description: 'Course dates: January 12 to April 15, 2026.'
  },
  {
    id: 'winter-term-ends',
    title: 'Winter Term Ends',
    date: new Date(2026, 3, 15), // April 15, 2026
    type: 'school',
    description: 'End of winter term. Course dates: January 12 to April 15, 2026.'
  },
  // Winter Term 2027
  {
    id: 'winter-term-2027-starts',
    title: 'Winter Term Starts',
    date: new Date(2027, 0, 11), // January 11, 2027
    type: 'school',
    description: 'Course dates: January 11 to April 14, 2027.'
  },
  {
    id: 'winter-term-2027-ends',
    title: 'Winter Term Ends',
    date: new Date(2027, 3, 14), // April 14, 2027
    type: 'school',
    description: 'End of winter term. Course dates: January 11 to April 14, 2027.'
  },
  // Spring/Summer Term - Session A
  {
    id: 'spring-summer-session-a-starts',
    title: 'Spring/Summer Term - Session A Starts',
    date: new Date(2026, 4, 4), // May 4, 2026
    type: 'school',
    description: 'Course dates: May 4 to July 24, 2026.'
  },
  {
    id: 'spring-summer-session-a-ends',
    title: 'Spring/Summer Term - Session A Ends',
    date: new Date(2026, 6, 24), // July 24, 2026
    type: 'school',
    description: 'End of Session A. Course dates: May 4 to July 24, 2026.'
  },
  // Spring/Summer Term - Session B
  {
    id: 'spring-summer-session-b-starts',
    title: 'Spring/Summer Term - Session B Starts',
    date: new Date(2026, 4, 4), // May 4, 2026
    type: 'school',
    description: 'Course dates: May 4 to June 12, 2026.'
  },
  {
    id: 'spring-summer-session-b-ends',
    title: 'Spring/Summer Term - Session B Ends',
    date: new Date(2026, 5, 12), // June 12, 2026
    type: 'school',
    description: 'End of Session B. Course dates: May 4 to June 12, 2026.'
  },
  // Spring/Summer Term - Session C
  {
    id: 'spring-summer-session-c-starts',
    title: 'Spring/Summer Term - Session C Starts',
    date: new Date(2026, 5, 22), // June 22, 2026
    type: 'school',
    description: 'Course dates: June 22 to July 31, 2026.'
  },
  {
    id: 'spring-summer-session-c-ends',
    title: 'Spring/Summer Term - Session C Ends',
    date: new Date(2026, 6, 31), // July 31, 2026
    type: 'school',
    description: 'End of Session C. Course dates: June 22 to July 31, 2026.'
  },
  // Make-up class days for holidays
  {
    id: 'makeup-victoria-day',
    title: 'Make-up Classes (Victoria Day)',
    date: new Date(2026, 4, 23), // May 23, 2026
    type: 'school',
    description: 'Classes are cancelled on Monday, May 18, in lieu of Victoria Day (statutory holiday). They will be held on Saturday, May 23, when the usual Monday course schedule will apply. This does not affect CO-OP or clinical placements.'
  },
  {
    id: 'makeup-canada-day',
    title: 'Make-up Classes (Canada Day)',
    date: new Date(2026, 6, 4), // July 4, 2026
    type: 'school',
    description: 'Classes are cancelled on Wednesday, July 1, in lieu of Canada Day (statutory holiday). They will be held on Saturday, July 4 when the usual Wednesday course schedule will apply. This does not affect CO-OP or clinical placements.'
  },
  {
    id: 'makeup-civic-holiday',
    title: 'Make-up Classes (Civic Holiday)',
    date: new Date(2026, 7, 8), // August 8, 2026
    type: 'school',
    description: 'Classes are cancelled on Monday, August 3, in lieu of Civic Holiday (statutory holiday). They will be held on Saturday, August 8 when the usual Monday course schedule will apply. This does not affect CO-OP or clinical placements.'
  },
  {
    id: 'makeup-good-friday-2026',
    title: 'Make-up Classes (Good Friday)',
    date: new Date(2026, 3, 14), // April 14, 2026
    type: 'school',
    description: 'Classes on Friday, April 3, Good Friday and statutory holiday, are cancelled. They will take place on Tuesday, April 14, when the usual Friday course schedule will apply. This does not affect CO-OP and clinical placements.'
  },
  {
    id: 'makeup-easter-saturday-2026',
    title: 'Make-up Classes (Easter Saturday)',
    date: new Date(2026, 3, 15), // April 15, 2026
    type: 'school',
    description: 'Classes on Saturday, April 4, Easter break (a statutory holiday), are cancelled. They will take place on Wednesday, April 15, when the usual Saturday course schedule will apply. This does not affect CO-OP and clinical placements.'
  },
  // Make-up class days for 2027
  {
    id: 'makeup-good-friday-2027',
    title: 'Make-up Classes (Good Friday)',
    date: new Date(2027, 3, 13), // April 13, 2027
    type: 'school',
    description: 'Classes on Friday, March 26, Good Friday (a statutory holiday), are cancelled. They will take place on Tuesday, April 13, when the usual Friday course schedule will apply. This does not affect CO-OP and clinical placements.'
  },
  {
    id: 'makeup-easter-saturday-2027',
    title: 'Make-up Classes (Easter Saturday)',
    date: new Date(2027, 3, 14), // April 14, 2027
    type: 'school',
    description: 'Classes on Saturday, March 27, Easter break (a statutory holiday), are cancelled. They will take place on Wednesday, April 14, when the usual Saturday course schedule will apply. This does not affect CO-OP and clinical placements.'
  },
  {
    id: 'makeup-thanksgiving-2026',
    title: 'Make-up Classes (Thanksgiving)',
    date: new Date(2026, 11, 9), // December 9, 2026
    type: 'school',
    description: 'Classes on Monday, October 12, Thanksgiving (a statutory holiday), are cancelled. They will take place on December 9, when the usual Monday course schedule will apply. This does not affect CO-OP and clinical placements.'
  },
  // Spring/Summer Exam Periods
  // Session B Exam Period - add event for each day
  ...Array.from({ length: 3 }, (_, i) => {
    const date = new Date(2026, 5, 15 + i) // June 15-17, 2026
    return {
      id: `exam-period-session-b-${i + 1}`,
      title: 'Exam Period (Session B)',
      date: date,
      type: 'school' as const,
      description: 'Exams are scheduled during the week and on the weekend, both during the day and in the evening. June 15 to 17, 2026.'
    }
  }),
  // Session A Exam Period - add event for each day
  ...Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2026, 6, 27 + i) // July 27 - August 2, 2026
    return {
      id: `exam-period-session-a-${i + 1}`,
      title: 'Exam Period (Session A)',
      date: date,
      type: 'school' as const,
      description: 'Exams are scheduled during the week and on the weekend, both during the day and in the evening. July 27 to August 2, 2026.'
    }
  }),
  // Session C Exam Period - add event for each day
  ...Array.from({ length: 3 }, (_, i) => {
    const date = new Date(2026, 7, 4 + i) // August 4-6, 2026
    return {
      id: `exam-period-session-c-${i + 1}`,
      title: 'Exam Period (Session C)',
      date: date,
      type: 'school' as const,
      description: 'Exams are scheduled during the week and on the weekend, both during the day and in the evening. August 4 to 6, 2026.'
    }
  }),
  // Canadian Holidays
  // 2025 Holidays
  {
    id: 'new-year-2025',
    title: 'New Year\'s Day',
    date: new Date(2025, 0, 1), // January 1, 2025
    type: 'holiday',
    description: 'New Year\'s Day - a public holiday in Canada'
  },
  {
    id: 'good-friday-2025',
    title: 'Good Friday',
    date: new Date(2025, 3, 18), // April 18, 2025
    type: 'holiday',
    description: 'Good Friday - a public holiday in Canada'
  },
  {
    id: 'easter-monday-2025',
    title: 'Easter Monday',
    date: new Date(2025, 3, 21), // April 21, 2025
    type: 'holiday',
    description: 'Easter Monday - a public holiday in Canada'
  },
  {
    id: 'victoria-day-2025',
    title: 'Victoria Day',
    date: new Date(2025, 4, 19), // May 19, 2025 (last Monday before May 25)
    type: 'holiday',
    description: 'Victoria Day - a public holiday in Canada'
  },
  {
    id: 'canada-day-2025',
    title: 'Canada Day',
    date: new Date(2025, 6, 1), // July 1, 2025
    type: 'holiday',
    description: 'Canada Day - a public holiday in Canada'
  },
  {
    id: 'labour-day-2025',
    title: 'Labour Day',
    date: new Date(2025, 8, 1), // September 1, 2025 (first Monday in September)
    type: 'holiday',
    description: 'Labour Day - a public holiday in Canada'
  },
  {
    id: 'thanksgiving-2025',
    title: 'Thanksgiving',
    date: new Date(2025, 9, 13), // October 13, 2025 (second Monday in October)
    type: 'holiday',
    description: 'Thanksgiving - a public holiday in Canada'
  },
  {
    id: 'remembrance-day-2025',
    title: 'Remembrance Day',
    date: new Date(2025, 10, 11), // November 11, 2025
    type: 'holiday',
    description: 'Remembrance Day - a public holiday in Canada'
  },
  {
    id: 'christmas-eve-2025',
    title: 'Christmas Eve',
    date: new Date(2025, 11, 24), // December 24, 2025
    type: 'holiday',
    description: 'Christmas Eve'
  },
  {
    id: 'christmas-2025',
    title: 'Christmas',
    date: new Date(2025, 11, 25), // December 25, 2025
    type: 'holiday',
    description: 'Christmas - a public holiday in Canada'
  },
  {
    id: 'boxing-day-2025',
    title: 'Boxing Day',
    date: new Date(2025, 11, 26), // December 26, 2025
    type: 'holiday',
    description: 'Boxing Day - a public holiday in Canada'
  },
  // 2026 Holidays
  {
    id: 'new-year-2026',
    title: 'New Year\'s Day',
    date: new Date(2026, 0, 1), // January 1, 2026
    type: 'holiday',
    description: 'New Year\'s Day - a public holiday in Canada'
  },
  {
    id: 'good-friday-2026',
    title: 'Good Friday',
    date: new Date(2026, 3, 3), // April 3, 2026
    type: 'holiday',
    description: 'Good Friday - a public holiday in Canada'
  },
  {
    id: 'easter-monday-2026',
    title: 'Easter Monday',
    date: new Date(2026, 3, 6), // April 6, 2026
    type: 'holiday',
    description: 'Easter Monday - a public holiday in Canada'
  },
  {
    id: 'victoria-day-2026',
    title: 'Victoria Day',
    date: new Date(2026, 4, 18), // May 18, 2026 (last Monday before May 25)
    type: 'holiday',
    description: 'Victoria Day - a public holiday in Canada'
  },
  {
    id: 'canada-day-2026',
    title: 'Canada Day',
    date: new Date(2026, 6, 1), // July 1, 2026
    type: 'holiday',
    description: 'Canada Day - a public holiday in Canada'
  },
  {
    id: 'civic-holiday-2026',
    title: 'Civic Holiday',
    date: new Date(2026, 7, 3), // August 3, 2026
    type: 'holiday',
    description: 'Civic Holiday - a public holiday in Canada'
  },
  {
    id: 'labour-day-2026',
    title: 'Labour Day',
    date: new Date(2026, 8, 7), // September 7, 2026 (first Monday in September)
    type: 'holiday',
    description: 'Labour Day - a public holiday in Canada'
  },
  {
    id: 'thanksgiving-2026',
    title: 'Thanksgiving',
    date: new Date(2026, 9, 12), // October 12, 2026 (second Monday in October)
    type: 'holiday',
    description: 'Thanksgiving - a public holiday in Canada'
  },
  {
    id: 'remembrance-day-2026',
    title: 'Remembrance Day',
    date: new Date(2026, 10, 11), // November 11, 2026
    type: 'holiday',
    description: 'Remembrance Day - a public holiday in Canada'
  },
  {
    id: 'christmas-eve-2026',
    title: 'Christmas Eve',
    date: new Date(2026, 11, 24), // December 24, 2026
    type: 'holiday',
    description: 'Christmas Eve'
  },
  {
    id: 'christmas-2026',
    title: 'Christmas',
    date: new Date(2026, 11, 25), // December 25, 2026
    type: 'holiday',
    description: 'Christmas - a public holiday in Canada'
  },
  {
    id: 'boxing-day-2026',
    title: 'Boxing Day',
    date: new Date(2026, 11, 26), // December 26, 2026
    type: 'holiday',
    description: 'Boxing Day - a public holiday in Canada'
  },
  // Family Day
  {
    id: 'family-day-2026',
    title: 'Family Day',
    date: new Date(2026, 1, 16), // February 16, 2026
    type: 'holiday',
    description: 'Family Day - a public holiday in Canada'
  },
  // 2027 Holidays
  {
    id: 'new-year-2027',
    title: 'New Year\'s Day',
    date: new Date(2027, 0, 1), // January 1, 2027
    type: 'holiday',
    description: 'New Year\'s Day - a public holiday in Canada'
  },
  {
    id: 'good-friday-2027',
    title: 'Good Friday',
    date: new Date(2027, 3, 9), // April 9, 2027
    type: 'holiday',
    description: 'Good Friday - a public holiday in Canada'
  },
  {
    id: 'easter-monday-2027',
    title: 'Easter Monday',
    date: new Date(2027, 3, 10), // April 10, 2027
    type: 'holiday',
    description: 'Easter Monday - a public holiday in Canada'
  },
  {
    id: 'victoria-day-2027',
    title: 'Victoria Day',
    date: new Date(2027, 4, 22), // May 22, 2027 (last Monday before May 25)
    type: 'holiday',
    description: 'Victoria Day - a public holiday in Canada'
  },
  {
    id: 'canada-day-2027',
    title: 'Canada Day',
    date: new Date(2027, 6, 1), // July 1, 2027
    type: 'holiday',
    description: 'Canada Day - a public holiday in Canada'
  },
  {
    id: 'civic-holiday-2027',
    title: 'Civic Holiday',
    date: new Date(2027, 7, 2), // August 2, 2027
    type: 'holiday',
    description: 'Civic Holiday - a public holiday in Canada'
  },
  {
    id: 'labour-day-2027',
    title: 'Labour Day',
    date: new Date(2027, 8, 6), // September 6, 2027 (first Monday in September)
    type: 'holiday',
    description: 'Labour Day - a public holiday in Canada'
  },
  {
    id: 'thanksgiving-2027',
    title: 'Thanksgiving',
    date: new Date(2027, 9, 11), // October 11, 2027 (second Monday in October)
    type: 'holiday',
    description: 'Thanksgiving - a public holiday in Canada'
  },
  {
    id: 'remembrance-day-2027',
    title: 'Remembrance Day',
    date: new Date(2027, 10, 11), // November 11, 2027
    type: 'holiday',
    description: 'Remembrance Day - a public holiday in Canada'
  },
  {
    id: 'christmas-eve-2027',
    title: 'Christmas Eve',
    date: new Date(2027, 11, 24), // December 24, 2027
    type: 'holiday',
    description: 'Christmas Eve'
  },
  {
    id: 'christmas-2027',
    title: 'Christmas',
    date: new Date(2027, 11, 25), // December 25, 2027
    type: 'holiday',
    description: 'Christmas - a public holiday in Canada'
  },
  {
    id: 'boxing-day-2027',
    title: 'Boxing Day',
    date: new Date(2027, 11, 26), // December 26, 2027
    type: 'holiday',
    description: 'Boxing Day - a public holiday in Canada'
  },
  {
    id: 'family-day-2027',
    title: 'Family Day',
    date: new Date(2027, 1, 15), // February 15, 2027
    type: 'holiday',
    description: 'Family Day - a public holiday in Canada'
  },
  // Easter Break 2026 - add event for each day
  ...Array.from({ length: 4 }, (_, i) => {
    const date = new Date(2026, 3, 3 + i) // April 3-6, 2026
    return {
      id: `easter-break-2026-${i + 1}`,
      title: 'Easter Break',
      date: date,
      type: 'school' as const,
      description: 'Easter Break: April 3 to 6, 2026.'
    }
  }),
  // Easter Break 2027 - add event for each day
  ...Array.from({ length: 4 }, (_, i) => {
    const date = new Date(2027, 2, 26 + i) // March 26-29, 2027
    return {
      id: `easter-break-2027-${i + 1}`,
      title: 'Easter Break',
      date: date,
      type: 'school' as const,
      description: 'Easter Break: March 26 to 29, 2027.'
    }
  }),
]
