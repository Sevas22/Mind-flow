import "dotenv/config"
import { neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import ws from "ws"
import bcrypt from "bcryptjs"
import { addDays, differenceInCalendarDays, parseISO } from "date-fns"

import { PrismaClient } from "../lib/generated/prisma/client"

neonConfig.webSocketConstructor = ws
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// The original mock data was authored as if "today" were 2026-07-14. Every
// date below is shifted by the same day-offset from *today* (whenever this
// script actually runs), so the seeded demo always feels current.
const MOCK_TODAY = parseISO("2026-07-14")
const REAL_TODAY = new Date()

function shift(dateStr: string, timeStr = "00:00"): Date {
  const [h, m] = timeStr.split(":").map(Number)
  const diff = differenceInCalendarDays(parseISO(dateStr), MOCK_TODAY)
  const shifted = addDays(REAL_TODAY, diff)
  shifted.setHours(h || 0, m || 0, 0, 0)
  return shifted
}

function parseSizeLabel(label: string): number {
  const match = label.match(/([\d.]+)\s*(KB|MB)/i)
  if (!match) return 0
  const value = parseFloat(match[1])
  return match[2].toUpperCase() === "MB" ? Math.round(value * 1024 * 1024) : Math.round(value * 1024)
}

const patientsData = [
  {
    mockId: "p1",
    name: "Sofia Reyes",
    age: 29,
    email: "sofia.reyes@email.com",
    phone: "+1 (415) 555-0142",
    status: "active" as const,
    reason: "Generalized anxiety",
    treatmentGoal: "Reduce daily anxiety and build sustainable coping strategies",
    progress: 68,
    totalSessions: 12,
    startedAt: "2026-03-02",
    tags: ["CBT", "Anxiety"],
    alerts: ["Sleep quality declining", "Upcoming work stressor (Jul 18)"],
    currentHomework: [
      { task: "Daily thought record journal", done: true },
      { task: "4-7-8 breathing before bed", done: false },
      { task: "Read chapter 3 of workbook", done: false },
    ],
  },
  {
    mockId: "p2",
    name: "Marcus Bell",
    age: 41,
    email: "marcus.bell@email.com",
    phone: "+1 (415) 555-0198",
    status: "active" as const,
    reason: "Work-related burnout",
    treatmentGoal: "Restore work-life boundaries and prevent relapse into burnout",
    progress: 45,
    totalSessions: 14,
    startedAt: "2026-04-18",
    tags: ["Burnout", "Stress"],
    alerts: ["Reports chronic fatigue"],
    currentHomework: [
      { task: "Hard stop at 6pm (3 days)", done: false },
      { task: "Schedule one restorative activity", done: true },
    ],
  },
  {
    mockId: "p3",
    name: "Aisha Kapoor",
    age: 34,
    email: "aisha.kapoor@email.com",
    phone: "+1 (415) 555-0177",
    status: "active" as const,
    reason: "Grief and loss",
    treatmentGoal: "Process bereavement and rebuild daily routine",
    progress: 52,
    totalSessions: 12,
    startedAt: "2026-04-01",
    tags: ["Grief", "Support"],
    alerts: ["Grief anniversary approaching (Aug 12)"],
    currentHomework: [
      { task: "Write a letter to her mother", done: false },
      { task: "Continue morning walks", done: true },
    ],
  },
  {
    mockId: "p4",
    name: "Daniel Okafor",
    age: 23,
    email: "daniel.okafor@email.com",
    phone: "+1 (415) 555-0163",
    status: "active" as const,
    reason: "Social anxiety",
    treatmentGoal: "Increase confidence in social and academic settings",
    progress: 30,
    totalSessions: 16,
    startedAt: "2026-06-02",
    tags: ["CBT", "Exposure"],
    alerts: [] as string[],
    currentHomework: [
      { task: "Initiate one small conversation daily", done: false },
      { task: "Rate anxiety before and after (0-10)", done: false },
    ],
  },
  {
    mockId: "p5",
    name: "Lena Hoffmann",
    age: 37,
    email: "lena.hoffmann@email.com",
    phone: "+1 (415) 555-0111",
    status: "active" as const,
    reason: "Relationship difficulties",
    treatmentGoal: "Improve communication patterns and emotional regulation",
    progress: 74,
    totalSessions: 14,
    startedAt: "2026-02-10",
    tags: ["Couples", "Communication"],
    alerts: [] as string[],
    currentHomework: [
      { task: "Weekly 20-minute partner check-in", done: true },
      { task: "Journal on conflict triggers", done: true },
    ],
  },
  {
    mockId: "p6",
    name: "James Carter",
    age: 52,
    email: "james.carter@email.com",
    phone: "+1 (415) 555-0125",
    status: "active" as const,
    reason: "Depression",
    treatmentGoal: "Lift mood, restore engagement in valued activities",
    progress: 40,
    totalSessions: 16,
    startedAt: "2026-05-12",
    tags: ["Depression", "Behavioral Activation"],
    alerts: ["Monitor mood — history of low mood"],
    currentHomework: [
      { task: "Schedule two pleasant activities", done: false },
      { task: "Daily mood rating", done: true },
    ],
  },
  {
    mockId: "p7",
    name: "Priya Nair",
    age: 31,
    email: "priya.nair@email.com",
    phone: "+1 (415) 555-0189",
    status: "finished" as const,
    reason: "Panic attacks",
    treatmentGoal: "Eliminate panic episodes and reduce avoidance",
    progress: 100,
    totalSessions: 12,
    startedAt: "2026-01-15",
    tags: ["CBT", "Panic"],
    alerts: [] as string[],
    currentHomework: [] as { task: string; done: boolean }[],
  },
  {
    mockId: "p8",
    name: "Tom Bradley",
    age: 46,
    email: "tom.bradley@email.com",
    phone: "+1 (415) 555-0150",
    status: "archived" as const,
    reason: "Stress management",
    treatmentGoal: "Develop stress management toolkit",
    progress: 100,
    totalSessions: 8,
    startedAt: "2026-01-08",
    tags: ["Stress"],
    alerts: [] as string[],
    currentHomework: [] as { task: string; done: boolean }[],
  },
]

const sessionsData = [
  {
    mockId: "s1",
    patientId: "p1",
    number: 8,
    date: "2026-07-07",
    time: "10:00",
    duration: 50,
    mood: "anxious" as const,
    reason: "Ongoing management of generalized anxiety",
    objectives: [
      "Review the week's thought records",
      "Introduce anticipatory anxiety strategies for upcoming review",
    ],
    topics: ["Work performance worry", "Sleep disruption", "Upcoming performance review"],
    interventions: [
      "Cognitive restructuring of catastrophic predictions",
      "Psychoeducation on the anxiety cycle",
    ],
    techniques: ["Thought records", "4-7-8 breathing", "Worry postponement"],
    homework: ["Continue thought record journal", "Breathing practice before bed"],
    observations:
      "Sofia arrived visibly tense but engaged well. Demonstrated growing ability to catch automatic thoughts.",
    nextReminder: "Check in on the July 18 performance review and anticipatory anxiety.",
    risk: "low" as const,
    followUp: "Continue weekly sessions; reassess sleep in two weeks.",
  },
  {
    mockId: "s2",
    patientId: "p1",
    number: 7,
    date: "2026-06-30",
    time: "10:00",
    duration: 50,
    mood: "neutral" as const,
    reason: "Ongoing management of generalized anxiety",
    objectives: ["Consolidate breathing techniques"],
    topics: ["Physical symptoms of anxiety", "Caffeine intake"],
    interventions: ["Interoceptive psychoeducation"],
    techniques: ["Diaphragmatic breathing"],
    homework: ["Reduce afternoon caffeine"],
    observations: "Good progress with breathing. Reported fewer physical symptoms.",
    nextReminder: "Follow up on caffeine reduction results.",
    risk: "low" as const,
    followUp: "Continue weekly.",
  },
  {
    mockId: "s3",
    patientId: "p2",
    number: 5,
    date: "2026-07-08",
    time: "14:00",
    duration: 50,
    mood: "low" as const,
    reason: "Burnout recovery",
    objectives: ["Establish after-hours boundaries"],
    topics: ["Email overwhelm", "Guilt around rest"],
    interventions: ["Values clarification", "Boundary setting"],
    techniques: ["Behavioral experiments", "Scheduling"],
    homework: ["Hard stop at 6pm three days this week"],
    observations: "Marcus is engaged but fatigued. Responded well to practical framing.",
    nextReminder: "Review results of the 6pm hard-stop experiment.",
    risk: "low" as const,
    followUp: "Continue weekly; monitor fatigue.",
  },
  {
    mockId: "s4",
    patientId: "p3",
    number: 6,
    date: "2026-07-06",
    time: "11:00",
    duration: 50,
    mood: "low" as const,
    reason: "Grief processing",
    objectives: ["Support reconnection with social network"],
    topics: ["Upcoming anniversary", "Family gathering"],
    interventions: ["Continuing bonds approach", "Behavioral activation"],
    techniques: ["Letter writing", "Ritual planning"],
    homework: ["Write a letter to her mother"],
    observations: "Tearful but reflective. Showed meaningful re-engagement.",
    nextReminder: "Plan a supportive session before the Aug 12 anniversary.",
    risk: "low" as const,
    followUp: "Continue weekly; increase support near anniversary.",
  },
  {
    mockId: "s5",
    patientId: "p6",
    number: 4,
    date: "2026-07-08",
    time: "09:00",
    duration: 50,
    mood: "low" as const,
    reason: "Depression treatment",
    objectives: ["Increase behavioral activation"],
    topics: ["Low motivation", "Social withdrawal"],
    interventions: ["Behavioral activation", "Activity scheduling"],
    techniques: ["Pleasant activity scheduling", "Mood monitoring"],
    homework: ["Schedule two pleasant activities"],
    observations: "Mood remains low but engaged with the plan. Monitor closely.",
    nextReminder: "Review mood ratings and activity completion.",
    risk: "moderate" as const,
    followUp: "Weekly sessions; reassess risk each session.",
  },
  {
    mockId: "s6",
    patientId: "p5",
    number: 10,
    date: "2026-07-05",
    time: "16:00",
    duration: 50,
    mood: "positive" as const,
    reason: "Relationship difficulties",
    objectives: ["Reinforce communication skills"],
    topics: ["Financial conflict", "Active listening"],
    interventions: ["Communication coaching"],
    techniques: ["Time-out technique", "Active listening"],
    homework: ["Weekly 20-minute check-in with partner"],
    observations: "Strong progress. Ready to begin relapse-prevention planning.",
    nextReminder: "Begin discussing treatment wind-down and maintenance.",
    risk: "low" as const,
    followUp: "Move toward biweekly sessions.",
  },
  {
    mockId: "s7",
    patientId: "p4",
    number: 3,
    date: "2026-07-09",
    time: "15:00",
    duration: 50,
    mood: "anxious" as const,
    reason: "Social anxiety",
    objectives: ["Begin graded exposure"],
    topics: ["Fear of speaking in seminars"],
    interventions: ["Graded exposure planning"],
    techniques: ["Exposure hierarchy", "Anxiety rating"],
    homework: ["Initiate one small conversation daily"],
    observations: "Early rapport building. Cautious but willing.",
    nextReminder: "Keep exposure pace gentle; reinforce small wins.",
    risk: "low" as const,
    followUp: "Continue weekly.",
  },
]

const appointmentsData = [
  { mockId: "a1", patientId: "p1", date: "2026-07-14", startTime: "10:00", endTime: "10:50", location: "Office 2B", status: "scheduled" as const, notes: "Follow up on performance review anxiety.", reminder: "1h" },
  { mockId: "a2", patientId: "p3", date: "2026-07-14", startTime: "11:30", endTime: "12:20", location: "Office 2B", status: "scheduled" as const, notes: "Grief anniversary preparation.", reminder: "1d" },
  { mockId: "a3", patientId: "p6", date: "2026-07-14", startTime: "14:00", endTime: "14:50", location: "Telehealth", status: "scheduled" as const, notes: "Behavioral activation review.", reminder: "1h" },
  { mockId: "a4", patientId: "p2", date: "2026-07-15", startTime: "14:00", endTime: "14:50", location: "Office 2B", status: "scheduled" as const, notes: "Review 6pm hard-stop experiment.", reminder: "1h" },
  { mockId: "a5", patientId: "p5", date: "2026-07-15", startTime: "16:00", endTime: "16:50", location: "Office 2B", status: "scheduled" as const, notes: "Relapse prevention planning.", reminder: "1h" },
  { mockId: "a6", patientId: "p4", date: "2026-07-16", startTime: "15:00", endTime: "15:50", location: "Office 2B", status: "scheduled" as const, notes: "Graded exposure check-in.", reminder: "1h" },
  { mockId: "a7", patientId: "p1", date: "2026-07-07", startTime: "10:00", endTime: "10:50", location: "Office 2B", status: "completed" as const, notes: "Anxiety management session.", reminder: "1h" },
  { mockId: "a8", patientId: "p2", date: "2026-07-08", startTime: "14:00", endTime: "14:50", location: "Office 2B", status: "completed" as const, notes: "Burnout recovery session.", reminder: "1h" },
  { mockId: "a9", patientId: "p7", date: "2026-07-10", startTime: "13:00", endTime: "13:50", location: "Telehealth", status: "cancelled" as const, notes: "Booster session — cancelled by patient.", reminder: "1d" },
  { mockId: "a10", patientId: "p4", date: "2026-07-09", startTime: "15:00", endTime: "15:50", location: "Office 2B", status: "completed" as const, notes: "Social anxiety session.", reminder: "1h" },
  { mockId: "a11", patientId: "p6", date: "2026-07-13", startTime: "09:00", endTime: "09:50", location: "Telehealth", status: "missed" as const, notes: "No-show — follow up to reschedule.", reminder: "1h" },
]

const documentsData = [
  { patientId: "p1", name: "Intake Questionnaire.pdf", category: "Intake" as const, date: "2026-03-02", size: "212 KB" },
  { patientId: "p1", name: "GAD-7 Assessment.pdf", category: "Assessment" as const, date: "2026-03-02", size: "88 KB" },
  { patientId: "p1", name: "Informed Consent.pdf", category: "Consent" as const, date: "2026-03-02", size: "140 KB" },
  { patientId: "p2", name: "Intake Questionnaire.pdf", category: "Intake" as const, date: "2026-04-18", size: "198 KB" },
  { patientId: "p2", name: "Maslach Burnout Inventory.pdf", category: "Assessment" as const, date: "2026-04-25", size: "104 KB" },
  { patientId: "p5", name: "Intake Questionnaire.pdf", category: "Intake" as const, date: "2026-02-10", size: "205 KB" },
  { patientId: "p5", name: "Progress Report — June.pdf", category: "Report" as const, date: "2026-06-28", size: "312 KB" },
  { patientId: "p7", name: "Discharge Summary.pdf", category: "Report" as const, date: "2026-06-20", size: "176 KB" },
]

const notesData = [
  { patientId: "p1", date: "2026-07-10", text: "Called to confirm the July 14 slot still works around her performance review prep — she asked to keep it." },
  { patientId: "p1", date: "2026-06-25", text: "Sofia mentioned she started a new meditation app on her own initiative. Worth asking how it's going." },
  { patientId: "p3", date: "2026-07-01", text: "Family gathering went better than expected per her voicemail. Good sign heading into the anniversary period." },
  { patientId: "p6", date: "2026-07-09", text: "Flag for supervision consult — want a second opinion on pacing given the low mood trend." },
]

const remindersData = [
  { patientId: "p1", text: "Check in on July 18 performance review anxiety", due: "2026-07-14", priority: "high" as const },
  { patientId: "p3", text: "Plan supportive session before Aug 12 anniversary", due: "2026-07-14", priority: "high" as const },
  { patientId: "p6", text: "Reassess mood and risk level", due: "2026-07-16", priority: "medium" as const },
  { patientId: "p2", text: "Review 6pm hard-stop experiment results", due: "2026-07-15", priority: "medium" as const },
  { patientId: "p5", text: "Draft relapse-prevention plan", due: "2026-07-15", priority: "low" as const },
]

async function main() {
  const password = process.env.SEED_THERAPIST_PASSWORD || "MindFlow123!"
  const passwordHash = await bcrypt.hash(password, 12)
  const email = "elena.marsh@mindflow.health"

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: "Dr. Elena Marsh",
      title: "Clinical Psychologist, PhD",
      license: "PSY-24817",
    },
  })

  const patientIdMap: Record<string, string> = {}
  for (const p of patientsData) {
    const created = await prisma.patient.create({
      data: {
        userId: user.id,
        name: p.name,
        age: p.age,
        email: p.email,
        phone: p.phone,
        status: p.status,
        reason: p.reason,
        treatmentGoal: p.treatmentGoal,
        progress: p.progress,
        totalSessions: p.totalSessions,
        tags: p.tags,
        alerts: p.alerts,
        startedAt: shift(p.startedAt),
        homework: {
          create: p.currentHomework.map((h, i) => ({ task: h.task, done: h.done, order: i })),
        },
      },
    })
    patientIdMap[p.mockId] = created.id
  }

  const sessionIdMap: Record<string, string> = {}
  for (const s of sessionsData) {
    const created = await prisma.session.create({
      data: {
        userId: user.id,
        patientId: patientIdMap[s.patientId],
        number: s.number,
        date: shift(s.date, s.time),
        status: "completed",
        duration: s.duration,
        mood: s.mood,
        reason: s.reason,
        objectives: s.objectives,
        topics: s.topics,
        interventions: s.interventions,
        techniques: s.techniques,
        homework: s.homework,
        achievements: [],
        observations: s.observations,
        nextReminder: s.nextReminder,
        risk: s.risk,
        followUp: s.followUp,
      },
    })
    sessionIdMap[s.mockId] = created.id
  }

  for (const a of appointmentsData) {
    await prisma.appointment.create({
      data: {
        userId: user.id,
        patientId: patientIdMap[a.patientId],
        startAt: shift(a.date, a.startTime),
        endAt: shift(a.date, a.endTime),
        location: a.location,
        status: a.status,
        notes: a.notes,
        reminderLeadTime: a.reminder === "1h" ? "oneHour" : a.reminder === "1d" ? "oneDay" : "none",
      },
    })
  }

  for (const d of documentsData) {
    await prisma.patientDocument.create({
      data: {
        userId: user.id,
        patientId: patientIdMap[d.patientId],
        name: d.name,
        category: d.category,
        sizeBytes: parseSizeLabel(d.size),
        uploadedAt: shift(d.date),
      },
    })
  }

  for (const n of notesData) {
    await prisma.quickNote.create({
      data: {
        userId: user.id,
        patientId: patientIdMap[n.patientId],
        text: n.text,
        createdAt: shift(n.date),
      },
    })
  }

  // Standalone reminders from the mock `reminders` list.
  for (const r of remindersData) {
    await prisma.reminder.create({
      data: {
        userId: user.id,
        patientId: patientIdMap[r.patientId],
        text: r.text,
        due: shift(r.due),
        priority: r.priority,
      },
    })
  }

  // Backfill each session's `nextReminder` as its own linked Reminder row too,
  // so the patient-profile "Therapist Reminder" card has real data on first run.
  for (const s of sessionsData) {
    await prisma.reminder.create({
      data: {
        userId: user.id,
        patientId: patientIdMap[s.patientId],
        sessionId: sessionIdMap[s.mockId],
        text: s.nextReminder,
        due: shift(s.date, s.time),
        priority: s.risk === "moderate" ? "medium" : "low",
      },
    })
  }

  console.log("\nSeed complete.")
  console.log(`Login   : ${email}`)
  console.log(`Password: ${password}`)
  console.log("(Change SEED_THERAPIST_PASSWORD in .env before any real deployment.)\n")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
